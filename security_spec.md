# Firebase Security Specification

## Data Invariants
1. A dating profile (`Profile`) must have a valid name, age, bio, and authorId.
2. Only Admins can approve a profile (set status to 'approved').
3. Users can submit profiles (status starts at 'pending').
4. Immutable fields: `authorId`, `createdAt`.
5. PII (if any) should be restricted. Currently, bio and location are public for approved profiles.

## The "Dirty Dozen" Payloads (PERMISSION_DENIED expected)
1. **Self-Approval**: User submits profile with `status: 'approved'`.
2. **Identity Spoofing**: User submits profile with `authorId` of another user.
3. **Status Hijack**: Non-admin updates a profile's `status` from 'pending' to 'approved'.
4. **Author Sabotage**: User A attempts to update/delete User B's profile.
5. **Admin Spoofing**: User attempts to write to `/admins/{uid}`.
6. **Resource Exhaustion**: User submits string fields > 5000 chars.
7. **Type Poisoning**: User sets `age` as a string.
8. **Orphaned Profile**: User submits profile referencing a non-existent category.
9. **Draft Leak**: Unauthenticated user attempts to list `pending` profiles.
10. **Admin Logic Bypassing**: User updates `role` in their admin document (if they found a way to write).
11. **Shadow Field Injection**: User adds `isVerified: true` to profile map.
12. **Time Manipulation**: User provides a manual `createdAt` far in the future instead of `request.time`.

## Security Rule Logic
- `isValidProfile(data)` helper enforcing schema.
- `isAdmin()` helper checking `/admins/$(request.auth.uid)`.
- Write constraints using `affectedKeys().hasOnly()`.
