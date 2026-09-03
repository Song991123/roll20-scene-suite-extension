# Korean Winter sheet live checkpoint — 0.6.42

## Scope

Development Sheet Sandbox 14742251 only. Original Winter HTML/CSS were uploaded, translation cleared, metadata restored to custom `legacy:false`, the VTT re-entered through the sandbox settings page, and Mod Scripts restarted (Ready 9.08 seconds). Installed 10 source was compared in full with local 0.6.42 and matched. No public release or production room was changed.

The ammunition-label experiment is HOLD at local commit `ed10110` on `codex/hotfix-table-resource-labels`. It was never installed in the room. Its incomplete umbrella test was stopped, not recorded as PASS. Current live-validation branch is based on `af7eb8a`.

## Newly observed live results

| Check | Evidence and result |
| --- | --- |
| Six fixed custom skills | Science, language, craft, survival, control and combat: original and Korean helper commands each returned 47/23/9, then 63/31/12 after actual edits. All success levels independently checked against the rolled values. 12 pairs / 24 actual rolls. |
| Short custom name | `!!ㅇㄴ` executed one roll without a choice menu, using 63/31/12. Former `!!추가과학` was rejected after renaming. |
| EDIT UI control | No EDIT state-tracking message appeared in the captured input/change interval. |
| Three valid repeating groups | Added science/language/craft rows: Korean/native comparison at 47 and after rename at 63. Six pairs / 12 rolls. Native growth checkboxes were observed checked; this is not a claim of a separate helper growth command. |
| Deleted-row safety | Temporary rows deleted. `!!ㅇㄴ` no longer found a roll; the previously rendered search button returned “선택한 굴림 또는 반복행이 바뀌었습니다.” |
| Madness | Original and helper `실시간` / `요약` displayed their own branch text and 1d10 round/hour duration. The sheet does not name its roll “일시”; `!!일시` returned not found and was not relabeled or silently added. |
| Weapon | Korean/native 25/12/5; native roll16 success and helper82 failure; damage was actually `1d6+0` (1 and 6), malfunction100. No ammunition field was filled or changed. |
| Unarmed | Korean/native 25/12/5, roll19 success and73 failure; both actual damage expressions were `1d3+0`. |
| Spell row | Name, casting time, cost and description matched native output: 검증주문 / 1라운드 / 마력2 / 검증용 설명입니다. No dice or automatic cost deduction invented; MP remained9. |
| Cutin | Public Korean 외모 roll63/failure visibly displayed the green/yellow cutin over the canvas. After expiration, private 외모 roll32/success was whispered with no new active cutin. GM-view observation only, not a separate player-account test. |
| Persistent tracker log | Actual MP9→8→9 was read from the sheet. After reconnect, the same message IDs and text remained as `message desc`: `-P0_IML5qVBb16JCG_HP`, `-P0_IN_UpllDWKEGd_r5`. |
| Post-reconnect command/status | `!!감정`: 5/2/1, roll29, failure. Status: 8 characteristics, 56 skill/check entries, 1 unarmed weapon, 2 madness commands. HP3/13, MP9/12, SAN45/start50. |

## Source issue, not a helper PASS

Winter's survival repeating row has input `live_title_read`, but its original button references `live_title`. The original button produced `No attribute was found for ...live_title` and printed the unresolved field name (message `-P0_Gt7WcaPc15Rz2PQ6`). The Korean helper command for the typed name returned not found (`-P0_GtBMCcv7Ug-2-OD5`). The author's source was not modified and this case is not marked passed.

## Cleanup and remaining work

All temporary science/language/craft/survival/weapon/spell rows from this continuation were removed; final repeating row count zero. Fixed fields were restored to their prior values (existing 변경과학63 retained; other fixed custom names blank). EDIT off; major wound on; dying/temporary/indefinite insanity off; HP3/13, MP9/12, SAN45/start50. Temporary cutin binding removed and duration restored to4 seconds. Character dialog closed.

Do not rerun the completed Winter 63 normal Korean/native pairs, modes or prior HP/SAN automation merely on context restoration. Their earlier evidence remains separate.

The two underscore-named repeating groups were subsequently tested on a new disposable character. Entering Korean names and modifiers46/47 changed their generated row IDs into `control` / `weapon` and left native calculated values blank. Each native button produced no chat during its10-second observation. Helper commands did produce47/23/9 (예외조종66/failure; 예외전투34/success), so this is not a claim that native and helper behaviors match. The original repeating structure is broken; no source rename or per-sheet runtime repair was made. Disposable character `검증-겨울-반복예외` was deleted through the native confirmation dialog; absence from the character selector and dialogs was verified. Retained Winter character was not deleted. Evidence: `.playwright-cli/domestic-pass2-winter-underscore42.json`.

The Korean 25-target, two-pass matrix and live 00–09 preservation work remain incomplete. Public index27 action-weapon and source-worker limitations also remain in the existing checkpoint. No blanket all-sheet PASS is claimed.

Detailed local evidence: `.playwright-cli/domestic-pass2-winter-fixed-resume42.json`, `domestic-pass2-winter-repeat-madness-resume42.json`, `domestic-pass2-winter-weapon-cutin-reload42.json`, `domestic-pass2-winter-magic-resume42.json`.
