# Design Guidelines: SkinSense - AI Skincare Ingredient Analyzer

## Design Approach
**Reference-Based Approach**: Drawing inspiration from health and beauty apps like Skincare.com and Yuka, combined with productivity app patterns from Linear for the multi-step forms. This approach balances visual appeal with functional utility for a health-focused application.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Light mode: 142 45% 25% (Deep sage green - trust and natural skincare)
- Dark mode: 142 35% 85% (Light sage - maintaining brand consistency)

**Supporting Colors:**
- Background light: 142 15% 98% (Subtle sage tint)
- Background dark: 142 8% 12% (Deep sage-tinted dark)
- Text primary: 142 10% 20% / 142 5% 95%
- Accent sparingly: 25 85% 65% (Warm coral for warnings/alerts only)

**Gradients:** Subtle sage-to-mint gradients (142 45% 25% to 165 35% 30%) for hero sections and card highlights.

### Typography
- **Primary**: Inter (Google Fonts) - clean, medical-grade readability
- **Headings**: Inter 600-700 weights
- **Body**: Inter 400-500 weights
- **Captions**: Inter 400 weight, smaller sizes

### Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8)
- Consistent 6-unit gaps between form sections
- 4-unit padding for cards and components
- 8-unit margins for major layout sections

### Component Library

**Core Components:**
- **Progress Stepper**: Horizontal dots with sage green fills for completed steps
- **Form Cards**: Subtle borders, soft shadows, rounded corners (rounded-lg)
- **Radio/Checkbox Groups**: Custom sage-themed selections with clear visual feedback
- **Upload Zone**: Dashed border with camera icon, drag-and-drop styling
- **Analysis Cards**: Clean cards with ingredient tags color-coded by safety rating
- **History Grid**: Masonry-style layout with product thumbnails

**Navigation:**
- Bottom tab bar for mobile (Camera, History, Profile)
- Breadcrumb navigation for multi-step forms
- Back buttons with clear labeling

**Safety Rating System:**
- Excellent: 142 50% 45% (darker sage)
- Good: 142 45% 55% (medium sage)  
- Not Bad: 45 25% 65% (neutral amber)
- Bad: 0 65% 55% (muted red)

### Mobile-First Considerations
- Single-column layouts with generous touch targets (min 44px)
- Swipe gestures for form navigation
- Large, clear buttons for camera and upload actions
- Sticky progress indicators during multi-step flows

### Key Screens Layout

**Multi-Step Form:**
- Clean progress indicator at top
- Single question per screen with large, tappable options
- Floating "Continue" button at bottom
- Subtle background gradient

**Camera/Upload Screen:**
- Central upload zone with camera icon
- Preview area for captured images
- Clear "Analyze" call-to-action button

**Analysis Results:**
- Header with product image thumbnail
- Scrollable ingredient list with color-coded tags
- Expandable details for each ingredient
- "Save to History" floating action button

**History Dashboard:**
- Grid of analysis cards with thumbnails
- Quick filter by safety ratings
- Search functionality for past analyses

### Images
No large hero images needed. Focus on:
- Product ingredient label photos (user-uploaded)
- Small ingredient thumbnails where relevant
- Icon-based visual communication throughout
- Clean, medical-aesthetic photography style for any supplementary content

### Accessibility & Localization
- High contrast ratios maintained in both light/dark modes
- Clear visual hierarchy with consistent heading sizes
- Support for Hindi/Tamil text rendering
- Offline-capable design patterns for poor connectivity areas

This design creates a trustworthy, professional health application that feels approachable and modern while maintaining the clinical accuracy expected in skincare analysis tools.