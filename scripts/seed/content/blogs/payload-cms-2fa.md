## Overall Plan

Payload has a robust JWT authentication implementation. I didn't have time to replace it with a custom auth layer that would match the same security guarantees, so instead I wanted to layer an OTP input on top of the existing login screen, keeping Payload's default login logic intact.

The approach: add an OTP step to the login flow, validate the code before forwarding credentials to Payload's own authentication endpoint.

## Steps

### 1. Create an OTP collection

Ideally you'd store OTP codes in Redis, but for simplicity we're using Payload's MongoDB database.

```ts
export const OTP: CollectionConfig = {
  slug: 'otp',
  admin: { hidden: true },
  access: {
    create: () => false,
    read: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'userEmail', type: 'email', required: true, index: true },
    { name: 'otpCode', type: 'text', required: true },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'isUsed', type: 'checkbox', defaultValue: false },
  ],
}
```

Include this in the `collections` array of your Payload config and run `generate:types`. In MongoDB, create a **TTL index** on the `expiresAt` field so documents are auto-deleted after expiration.

### 2. Create a custom login UI

I recreated Payload's default login screen and added an OTP input field. First, a utility function to hash OTP codes using HMAC-SHA256 with Payload's secret:

```ts
export function hashWithHmac(value: string): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('Failed to generate hash.')
  return createHmac('sha256', secret).update(value).digest('hex')
}
```

Then a server action to generate and send the OTP via email; it checks if the user exists, whether they're locked out, and if a valid OTP was already sent within the last minute. The code generates a random 6-digit OTP, hashes it, stores it in the OTP collection, and sends it to the user.

Next, a client-side OTP input component using Payload's `NumberField` with a "Send OTP" button. And a login form component that includes the email field, password field, and the OTP component, all wired to submit to a custom route handler.

### 3. Create the login route handler

A custom `/api/login` route that intercepts the login request:

- Validates the OTP against the database (hashed comparison, expiry check, not already used)
- On failure: returns Payload's translation-based error messages (consistent UX)
- On success: forwards the request to Payload's default `/api/users/login` endpoint and marks the OTP as used

If the OTP is invalid, login attempts are tracked and the account locks after the configured max attempts, matching Payload's built-in brute-force protection.

### 4. Overwrite English translations

Since we forward to Payload's default endpoint, error messages come from Payload's translation system. To keep messages ambiguous (e.g., "The email, password or OTP provided is incorrect"), I overrode the English translation object in Payload's config.

### 5. Update Payload config

Three changes to `payload.config.ts`:
- **Translations:** Point `i18n.translations.en` to the custom translation file
- **Route:** Move the default login route to `/deprecated-login` so Payload doesn't serve its own login page
- **Custom view:** Register the custom `LoginView` component at the `/login` path

### 6. Update Next.js config

Add a permanent redirect from `/admin/deprecated-login` to `/admin/login` so logged-out users are redirected to the custom login screen.

## Known Issues

- **Error handling / translations:** Overwriting the entire English translation object doesn't scale well for multi-language support. This needs a better approach.
- **CORS:** I wasn't able to fully test CORS behavior with this setup.

If I resolve either of these I'll update the [GitHub repository](https://github.com/zarif-al/payload-cms-2fa-implementation).
