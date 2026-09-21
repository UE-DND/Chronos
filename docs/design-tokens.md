# Chronos Design Tokens

## Layers and ownership

Theme plugins own color values and algorithms. The host generates first-paint CSS from the Profile default theme, then applies the active theme at runtime. Workbench keys and Tailwind mappings are shared contracts, independent of M3. See [ADR 0043](../.agents/docs/adr/0043-theme-owned-color-runtime-and-plugin-host-contracts.md).

| Change                                   | Source                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| M3 colors, seed and algorithm            | [theme-m3/src/m3-theme.ts](../packages/plugins/theme-m3/src/m3-theme.ts) |
| Static theme colors                      | The theme plugin's colors JSON                                           |
| Allowed color keys and CSS mappings      | [workbench-colors.ts](../packages/core/src/theme/workbench-colors.ts)    |
| Typography (`text-*`)                    | [typography.css](../apps/web/src/lib/theme/typography.css)               |
| Radius                                   | [radius.css](../packages/ui-kit/src/theme/radius.css)                    |
| Elevation                                | [elevation-tokens.css](../apps/web/src/lib/theme/elevation-tokens.css)   |
| Component patterns (`ui-*`)              | [ui-patterns.css](../apps/web/src/lib/theme/ui-patterns.css)             |
| Shell dimensions, safe areas and z-index | [layout-tokens.css](../apps/web/src/lib/theme/layout-tokens.css)         |

Normal dev/build generates resources in ignored directories. Use `vp run theme:generate` when intentionally updating default-theme source snapshots and first-paint colors; do not edit generated CSS directly.

## Plugin styles

UI plugins import `@chronos/ui-kit/theme/plugin-tailwind.css` and declare their own Tailwind `@source`. This provides utilities without Preflight and bridges semantic colors to host CSS variables. The host supplies shared `text-*` and `ui-*` patterns; it does not scan business plugin source.

## Surfaces and elevation

| Surface  | Pattern                     | Use                                                               |
| -------- | --------------------------- | ----------------------------------------------------------------- |
| Outlined | Border only                 | Inputs, outlined cards, segmented tracks                          |
| Raised   | `ui-section-surface`        | Grouped lists and cards; includes its designed border/shadow pair |
| Floating | `shadow-floating`           | Snackbar and tooltips                                             |
| Overlay  | `shadow-overlay`, no border | Dialog, BottomSheet and DatePicker                                |
| Inset    | `shadow-inner`              | Drag placeholders                                                 |
| Control  | `shadow-control`            | Switch and slider thumbs                                          |

Avoid adding generic shadows to bordered surfaces or nesting raised surfaces. Inputs and buttons have no elevation shadow, including on hover.

`ui-section-surface--comfortable` supplies form padding; use `ui-section-stack` inside for vertical spacing. Reuse `ui-btn*` for actions and `ui-form-field*` for inputs. Prefer ui-kit `SegmentedControl` for keyboard and tablist behavior.

## Radius and stacking

Use standard `border-radius` with semantic utilities such as `rounded-dialog` and `rounded-t-sheet`. Values live in `radius.css`, rather than a second table here.

Use the z-index tokens in `layout-tokens.css`: shell, secondary page, overlay, toast and onboarding. For example, `z-[var(--z-overlay)]`; avoid arbitrary numeric z-index values.
