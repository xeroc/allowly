# Allowly Demo Video

15-second demo video for Allowly - Pocket Money, the web3 way.

## What's Included

### Video Composition: `AllowlyDemo`

- Duration: 450 frames (15 seconds @ 30fps)
- Resolution: 1920x1080 (Full HD, 16:9 aspect ratio)

### Scenes with Enhanced Headlines

1. **Process Steps (0-90 frames):** 4-step process explanation

   - Headline: "Automate pocket money in 4 simple steps" (Slide & Scale transition, 30% faster)
   - Keywords highlighted: "Automate" + "4 simple steps" (emerald gradient)
   - Animated cards: Connect Wallet → Enter Child's Wallet → Set Amount & Frequency → Create Allowance
   - Headline z-index: 100 (above all content)

2. **Form Interaction (90-240 frames):** Typing animation showing form filling (30% shorter duration)

   - Headline: "Setup in under a minute. No account required." (Text Reveal transition)
   - Keywords highlighted: "under a minute" + "No account" (emerald gradient)
   - Wallet address: `8zN...7kPm`
   - Amount: `$50 USDC`
   - Frequency: `Weekly`
   - **NEW:** Mouse cursor animation at frame 210
   - **NEW:** Button click highlight (frame 210-225) with color change (#6EE7B7) and glow
   - **NEW:** Fade out animation (frames 230-245)

3. **Success State (240-450 frames):** Policy card confirmation (starts 30 frames earlier!)

   - Headline: "Done. Payments handle themselves." (Color Glow transition)
   - Keywords highlighted: "handle themselves" (emerald gradient)
   - **NEW:** Fast fade in (frames 240-255)
   - **NEW:** Fast popup scale animation (frames 240-270)
   - Success checkmark animation
   - Recipient info
   - Payment details ($50 weekly)
   - Secure / On-chain badges

4. **FINAL CTA (435-450 frames):** Short presentation at top of screen
   - **NEW:** Top bar (200px height) with gradient fade-in
   - Headline: "Try Allowly now" (large, spring scale animation)
   - **NEW:** Centered link: "allowly.app" (emerald gradient button, staggered scale)
   - Full width backdrop blur overlay
   - Highest z-index (200) to appear over everything
   - Professional fade-in/out (15 frames each)

### Components

- **CallToAction** - Final CTA component at TOP of screen:

  - Full-width top bar (200px height)
  - Gradient background fade-in (black → dark purple)
  - Centered headline with spring scale
  - Centered emerald gradient link button
  - Backdrop blur overlay
  - z-index: 200 (highest, over all content)
  - Clean, minimal, high-impact design

- **EnhancedHeadline** - Modern headline component with 3 transition types:

  - `slide` - Fast upward slide with scale (Scene 1, 30% faster)
  - `text` - Letter-by-letter reveal with subtle scale (Scene 2)
  - `color` - Color transition with glow pulse (Scene 3)
  - Keyword highlighting with gradient text (emerald #10B981 → green #14F195)
  - Slightly larger font on keywords (1.05x multiplier)
  - Stronger keyword weight (800 instead of 700)
  - Dynamic glow shadow based on scene
  - **NO shadowed border** (removed as requested)
  - Center-screen positioning (25% from top, above content)
  - z-index: 100 (ensures headlines render above other content)

- **MouseCursor** - Animated cursor component

  - Positionable via x, y props
  - Scale adjustment option
  - Active state for clicking (emerald color)
  - Two-layered path (background + foreground)
  - Active state spring animation (damping 15, stiffness 200)

- **Background** - Mesh gradient background matching Allowly app
- **SolanaLogo** - Solana branding icon (purple/green gradient)
- **USDCIcon** - USDC token icon
- **ProcessSteps** - 4-step process cards with staggered reveal
- **FormInteraction** - Typing effect form with button click animation
  - **NEW:** Removed "Configure Subscription" title (shorter duration)
  - **NEW:** Mouse cursor animation (appears at frame 210)
  - **NEW:** Button click highlight (frame 210-225)
  - **NEW:** Fade out animation (frames 230-245)
- **SuccessState** - Policy card with checkmark animation
  - **NEW:** Starts at frame 240 (30 frames earlier)
  - **NEW:** Fast fade in (240-255)
  - **NEW:** Fast popup scale animation (240-270)
  - Success checkmark animation (frames 255-285)
  - Recipient info
  - Payment details ($50 weekly)
  - Secure / On-chain badges

### Transitions

**Scene 1 - Slide & Scale (Fast, 0.33s)**

- Slides up 60px while scaling from 0.9 to 1.0
- Spring animation: damping 25, stiffness 140 (30% faster than before)
- Duration: 10 frames (0.33s instead of 0.5s)
- No fade - pure transform
- Professional, confident entrance
- Headline z-index 100 (ensures it's above ProcessSteps)

**Scene 2 - Text Reveal (Sophisticated, 1s)**

- Letter-by-letter reveal with 20ms spacing
- Subtle scale effect during reveal
- No fade needed - pure character animation
- Modern tech aesthetic
- Scene duration: 150 frames (5s, down from 180 frames)

**Scene 3 - Color Glow (Premium, 0.8s)**

- Gray → white → emerald gradient color transition
- Pulsing glow intensity (0 → 0.6)
- Three-stage color animation
- Premium/luxury feel
- Scene duration: 210 frames (7s, up from 180 frames)

**Final CTA - Spring Scale (Professional, 0.5s)**

- Fade in: 15 frames
- Spring scale: 435-450 (15 frames)
- Staggered link: appears 15 frames after headline
- Gradient background with backdrop blur
- Top positioning with highest z-index (200)

**Form Fade Out (0.5s)**

- Frames 230-245
- Smooth opacity transition to 0
- Allows SuccessState to fade in

**SuccessState Fast Popup (1s)**

- Frames 240-255: Fade in
- Frames 240-270: Scale spring animation
- Total popup time: 30 frames (1s)
- Faster and more dynamic than original fade

### Visual Enhancements

#### Keyword Highlighting

- Gradient text (emerald #10B981 to green #14F195)
- Slightly larger font (1.05x multiplier)
- Stronger weight (800 instead of 700)
- Dynamic glow shadow (0.2-0.4 intensity based on scene)

#### Backdrop & Depth

- Semi-transparent glassmorphism (0.2 opacity for color scenes)
- 20px backdrop blur
- No border for slide/text scenes (cleaner look)
- Accent border for color glow scene (2px solid with dynamic opacity)
- Multi-layered shadows for depth

#### Glow Effects

- Scene 1: Outer glow 0.15 (scaling with animation)
- Scene 2: Subtle glow 0.1 (minimal)
- Scene 3: Pulsing glow 0.1 → 0.6 (dynamic)
- Shadow-based glow system

#### Final CTA Enhancements

- Full-width top bar (200px height)
- Gradient fade-in (black 0.8 → dark purple 0.6)
- Centered "Try Allowly now" headline (56px)
- Emerald gradient link button (32px text)
- Button padding: 16px 32px, rounded 12px
- Backdrop blur overlay (30px)
- z-index 200 (over everything)
- Shadow: 0 4px 20px emerald glow
- Text shadow: 0 4px 20px white glow

#### Mouse Cursor Animation

- Two-layered SVG cursor
- Background path (0.6 opacity white)
- Foreground path (emerald when active)
- Active state spring animation (damping 15, stiffness 200)
- Scale 1.2x when active (clicking)
- Positioned at button location (frame 210)

#### Button Click Animation

- Background gradient shift to #6EE7B7 (light green)
- Border flash to #6EE7B7
- Shadow intensification (from 0.2 to 0.6)
- Duration: 15 frames (0.5s)
- Smooth spring scale effect

#### Typography

- Large: 64px (Scene 1 & 3)
- Medium: 48px (Scene 2)
- Small: 36px (available)
- Tight line heights (1.1-1.2)
- Bold weights (700 base, 800 for keywords)
- CTA headline: 56px
- CTA link: 32px
- Center-screen positioning (25% for main headlines, TOP for CTA)

### Animation Timeline

**Frames 0-10:** Headline 1 zoom in (slide + scale, 30% faster)
**Frames 0-45:** ProcessSteps cards staggered reveal (z-index 1)
**Frames 90-105:** Headline 2 fade in
**Frames 105-150:** Form typing animations (wallet, amount)
**Frames 150-210:** Form continues typing
**Frames 210-225:** Mouse cursor appears, clicks, button highlight
**Frames 225-230:** Button highlight fades
**Frames 230-245:** Form fades out (shorter 0.5s transition)
**Frames 240-255:** Headline 3 fade in, SuccessState scales in
**Frames 255-285:** SuccessState checkmark animates
**Frames 285-450:** All content visible
**Frames 435-450:** Final CTA overlay appears (z-index 200)
**Frames 435-450:** CTA headline and link scale in

## Commands

**Start Preview:**

```console
pnpm --filter remotion run dev
```

**Build for Render:**

```console
pnpm --filter remotion run build
```

**Render MP4:**

```console
pnpm --filter remotion exec remotion render AllowlyDemo --out=allowly-demo.mp4
```

**Render GIF:**

```console
pnpm --filter remotion exec remotion render AllowlyDemo --out=allowly-demo.gif --codec=gif
```

## Customization

### Edit Headlines

Change headline text, transition type, and keywords in `src/Composition.tsx`:

```tsx
<EnhancedHeadline
  text="Your message here"
  startFrame={0}
  endFrame={90}
  size="large" // "large" | "medium" | "small"
  transition="slide" // "slide" | "text" | "color"
  keywords={[
    { word: "Automate", color: "#10B981" },
    { word: "highlighted text", color: "#14F195" },
  ]}
/>
```

### Edit Final CTA

Change CTA text and URL in `src/Composition.tsx`:

```tsx
<CallToAction
  text="Try Allowly now"
  url="https://allowly.app"
  startFrame={435}
  endFrame={450}
/>
```

### Edit Form Data

Change constants in `src/components/FormInteraction.tsx`:

```tsx
const walletAddress = "8zN...7kPm";
const amount = "50";
const frequency = "Weekly";

// Adjust button click timing
const CLICK_FRAME = 210;
const CLICK_HIGHLIGHT_DURATION = 15;
```

### Edit Success State Timing

Change start frame in `src/Composition.tsx`:

```tsx
<SuccessState /> // Currently starts at frame 240
```

### Edit Timing

Adjust scene durations in `src/Composition.tsx`:

```tsx
durationInFrames={450} // Total duration
fps={30} // Frame rate
width={1920} // Width
height={1080} // Height
```

## Notes

- **No fade transitions** - All animations use transforms, color, or opacity for pure entrance/exit
- **Headlines above content** - z-index 100, positioned at 25% from top
- **Final CTA at TOP** - Full-width top bar, z-index 200, appears last 15 seconds
- **No shadowed borders** - Removed from headlines for cleaner look
- **Mouse cursor animation** - Professional click simulation
- **Button click highlight** - Green flash on "Create Allowance" button
- **Form fade out** - Smooth transition to SuccessState
- **SuccessState fast popup** - 1s scale animation
- **Scene 2 shortened** - 150 frames instead of 180 (5s instead of 6s)
- **Scene 3 extended** - 210 frames instead of 180 (7s instead of 6s)
- Matches Allowly app color scheme: dark background (#0A0F1C), emerald accent (#10B981)
- Includes Solana branding (purple/green gradient) and USDC icon
- Modern tech aesthetic with professional transitions
- Ready for social media (16:9 aspect ratio)

## Animation Philosophy

**Why These Animations Work:**

1. **Professional** - Used in high-end commercials, tech product launches
2. **Fast** - Respect modern attention spans (0.33-1s max for transitions)
3. **Unique** - Each scene has distinct animation style
4. **Impactful** - Top positioning with high z-index
5. **Interactions** - Mouse cursor and button click add polish
6. **Smooth scene transitions** - Form fades out before SuccessState pops in
7. **Final CTA** - Professional overlay that doesn't distract but provides clear CTA

## Next Steps

1. Add background music via `<Audio>` from Remotion
2. Export optimized formats for platforms:
   - Twitter/X: 1280x720 (smaller file size)
   - LinkedIn: 1920x1080 (this version)
   - Instagram Feed: 1080x1080 (square crop)
3. Consider adding subtle motion graphics or particles for Scene 1
4. Test headline copy variations for A/B testing performance
5. Fine-tune button click timing for natural feel
