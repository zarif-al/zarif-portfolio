# Building a Conference Schedule Table with One GROQ Query

The brightonSEO schedule table pulls data from six entity levels — Event, Day Schedule, Time Slot, Session, Talk, and Person — and resolves it all in a single GROQ query. Here is how we designed it.

## The Problem

A single row in the schedule table looks like this:

```text
09:00 · The Future of SEO · Jane Smith · Room A
```

That one line needs data from an Event (the date), a Time Slot (the start time), a Session (the title), a Venue (the room), a Talk (the title and keynote flag), and a Person (the name and photo). All six come from different documents in Sanity, connected through a nested tree structure four levels deep.

The naive approach would be to query the event, then loop through each day, then each time slot, then each session, firing a query per item. With hundreds of time slots across a three-day conference, that adds up fast. We needed one query that returned everything.

## The Data Shape

An event's schedule lives as an array of day schedules on the event document. Each day schedule has a date and an array of time slots. Each time slot has a start time and an array of items — and here is where it gets interesting. An item can be one of three types: a reference to a Session document, an inline Minor Activity object, or an inline Major Activity object. Each type needs different data projected from it.

```text
Event
└─ schedule[]
   └─ Day Schedule
      ├─ date
      └─ timeSlots[]
         └─ Time Slot
            ├─ startTime
            └─ items[]
               ├─ Session (reference) → talks[] → talk → speakers[]
               ├─ Minor Activity (inline object)
               └─ Major Activity (inline object)
```

## The Query

Here is the core of the query. It lives inside a fragment that runs against the event document:

```text
schedule[]{
  date,
  timeSlots[]{
    startTime,
    items[]{
      _type == "session" => @->{
        title,
        venue->{ name },
        talks[]{
          duration,
          talk->{
            title,
            isKeynote,
            speakers[]->{ fullName, image }
          }
        }
      },
      _type == "minorActivityObject" => {
        duration,
        minorActivity->{ title, description, sponsors[]->{ name } }
      },
      _type == "majorActivityObject" && defined(majorActivity->eventContents[event->seo.slug.current == ^.^.^.^.seo.slug.current][0]) => {
        duration,
        majorActivity->{
          title,
          eventContents[event->seo.slug.current == ^.^.^.^.^.seo.slug.current][0]{
            description,
            venue,
            sponsors[]->{ name }
          }
        }
      }
    }
  }
}
```

## What Makes It Work

Three GROQ features handle the complexity.

**Conditional projection (`_type == "session" =>`)**: Since a time slot's items array can hold three different types, we use GROQ's conditional syntax to project different fields depending on the item's `_type`. This keeps the query flat — no separate queries for sessions, minor activities, and major activities.

**Dereference and expand (`@->`)**: When an item is a reference (like `session`), `@->` follows the reference and projects fields from the target document. This is how we go from a session reference in a time slot all the way down to a speaker's name and photo without leaving the query.

**Scope traversal (`^.^.^.`)**: The major activity filter needs to compare the activity's event slug with the event slug of the schedule we are querying. GROQ's `^` operator walks up the scope chain — `^.^.^.^.seo.slug.current` goes up four levels from inside the eventContents filter to reach the event document. At the time, this was undocumented behavior we discovered through trial and error.

## The Hard Part

The nested traversal was not the challenge — GROQ handles that naturally. The hard part was the conditional branching. Each item type needed different logic. Sessions needed talk and speaker expansion. Minor activities needed sponsor resolution. Major activities needed an additional filter to ensure we only picked event contents matching the current event slug.

Getting the scope traversal right for that filter took the most iteration. Every `^` moves up one level in the query context, and with four or five levels of nesting, miscounting by one level returns nothing or the wrong data. We learned to build these queries incrementally: start at the innermost projection and verify it returns data, then work outward one scope level at a time.

The venue also carried a sponsor subquery for session items, which added another layer of complexity. Each venue needed to resolve its sponsors filtered by the current event, requiring a separate GROQ expression inside the venue projection.

## What We Would Do Differently Today

At the time, Sanity was relatively new and we were early adopters. Now, Sanity's Content Source Maps and Visual Editing would make debugging deeply nested references far easier. We would also break the query into smaller fragments with Next.js's fetch deduplication handling the assembly on the server side — trading one large query for several focused ones with better cacheability and clearer error messages.
