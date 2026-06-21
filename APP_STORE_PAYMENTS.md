# Cat Purrsonality Apple App Store Payment Plan

## Recommended first paid product

- Product type: Non-consumable in-app purchase
- Product ID: `com.purrsonality.full_report`
- Display name: `Full Cat Report`
- Suggested price: `$9.99`
- Unlocks: Full Cat Purrsonality report, category scores, primary/secondary type, owner concern scenario outlooks, strengths, challenges, and recommendations.

## Apple Developer setup

1. Enroll in the Apple Developer Program.
2. Create an app in App Store Connect named `Cat Purrsonality`.
3. Add an in-app purchase with product ID `com.purrsonality.full_report`.
4. Add screenshots, privacy policy URL, support URL, app description, keywords, and age rating.
5. In Xcode, enable In-App Purchase capability.
6. Connect the React app to StoreKit through a native iOS wrapper.
7. Replace the temporary `window.PurrsonalityStoreKit` bridge with real StoreKit purchase and restore calls.
8. Test purchases with StoreKit testing and App Store sandbox testers.
9. Submit the app and the in-app purchase together for review.

## Product model options

- One-time report unlock: easiest to approve and explain.
- Monthly subscription: better for shelters, breeders, rescues, or multi-cat users.
- Free quiz with paid report: best conversion path for consumer users.

## Current app behavior

The app now gates the final report behind an Apple-style unlock screen. In the browser, the unlock button stores a local development purchase so you can preview the paid report. In the iOS version, that same button should call StoreKit and unlock only after Apple confirms the purchase.
