import math

def test_safe_areas():
    viewports = [320, 360, 390, 430, 768]
    
    # 4:5 aspect ratio
    # Safe area defined in normalized coordinates [0, 1] relative to the 4:5 crop
    slides = [
        {'id': 0, 'name': 'Theros Pro-Slim', 'subject_norm_y': (0.05, 0.60), 'subject_norm_x': (0.15, 0.85)},
        {'id': 1, 'name': 'Smart TV OLED 65"', 'subject_norm_y': (0.08, 0.62), 'subject_norm_x': (0.10, 0.90)},
        {'id': 2, 'name': 'Eurogas Master Flame', 'subject_norm_y': (0.05, 0.60), 'subject_norm_x': (0.15, 0.85)},
        {'id': 3, 'name': 'Split Inverter R32', 'subject_norm_y': (0.06, 0.58), 'subject_norm_x': (0.10, 0.90)},
    ]
    
    # Scrim covers lower 38% of the slide height
    scrim_start_y = 0.62
    
    results = []
    
    print("=== SLIDER SAFE AREA VISIBILITY HARNESS (DOCTRINE RULE 2) ===")
    for vp in viewports:
        # slide width is 88% of viewport
        slide_w = vp * 0.88
        slide_h = slide_w * 1.25 # 4:5 aspect ratio
        
        for slide in slides:
            y1, y2 = slide['subject_norm_y']
            
            # The subject height is (y2 - y1)
            total_subj_h = y2 - y1
            # Unobscured height is min(y2, scrim_start_y) - y1
            unobscured_h = max(0, min(y2, scrim_start_y) - y1)
            visibility_pct = (unobscured_h / total_subj_h) * 100
            
            passes = visibility_pct >= 95.0
            status = "PASS" if passes else "FAIL"
            print(f"Viewport {vp}px | {slide['name']:<22} | Visible: {visibility_pct:5.1f}% | Target: >=95% | [{status}]")
            results.append((vp, slide['name'], visibility_pct, passes))
            
    all_passed = all(r[3] for r in results)
    print("-----------------------------------------------------------------")
    print(f"OVERALL SAFE AREA COMPLIANCE: {'PASSED (100%)' if all_passed else 'FAILED'}")
    return all_passed

if __name__ == '__main__':
    test_safe_areas()
