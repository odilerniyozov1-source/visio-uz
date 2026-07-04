#!/bin/bash
# VISIO images — sequential generation with retry (avoid 429)
cd /home/z/my-project/public/images

gen() {
  local name="$1"; local prompt="$2"; local size="${3:-1024x1024}"
  if [ -f "$name.png" ] && [ $(stat -c%s "$name.png" 2>/dev/null || echo 0) -gt 5000 ]; then
    echo "SKIP $name (exists)"; return
  fi
  for attempt in 1 2 3; do
    echo "GEN $name (attempt $attempt) ..."
    if z-ai image -p "$prompt" -o "$name.png" -s "$size" 2>&1 | tail -3; then
      if [ -f "$name.png" ] && [ $(stat -c%s "$name.png" 2>/dev/null || echo 0) -gt 5000 ]; then
        echo "  OK $name ($(stat -c%s "$name.png") bytes)"
        return
      fi
    fi
    echo "  retry in $((attempt*5))s..."
    sleep $((attempt*5))
  done
  echo "  FAIL $name"
}

gen hero "Photorealistic 3D architectural render of a luxury modern living room, floor to ceiling windows with golden hour sunlight, warm wood accents, minimalist designer furniture, marble floor, plants, high-end real estate marketing visualization, ultra detailed, professional 3D render" "1344x768"

gen before-1 "Clean architectural 2D floor plan drawing of a 3-room apartment, top-down view, black lines on white paper, technical drawing, dimensions labeled, doors and windows shown, professional blueprint" "1024x1024"

gen after-1 "Photorealistic 3D interior render of a modern apartment living room, open plan kitchen, sofa, dining table, warm lighting, wood floor, designer furniture, real estate visualization" "1024x1024"

gen before-2 "Empty bare unfurnished room with white walls and concrete floor, single window, real estate listing photo, wide angle, daylight" "1024x1024"

gen after-2 "Beautifully staged luxury bedroom interior, king bed with elegant linens, nightstands, lamps, rug, artwork, warm ambient lighting, professional real estate photography" "1024x1024"

gen style-modern "Modern minimalist living room interior, clean lines, neutral palette, designer sofa, large windows, contemporary furniture, architectural digest style, photorealistic" "1024x1024"

gen style-scandi "Scandinavian interior design living room, light wood, white walls, cozy textiles, hygge, natural light, plants, minimalist, photorealistic" "1024x1024"

gen style-eastern "Eastern oriental luxury living room, rich textures, ornate patterns, warm colors, brass accents, suzani textiles, mashrabiya screens, modern oriental interior design, photorealistic" "1024x1024"

gen style-loft "Industrial loft interior, exposed brick walls, concrete floor, steel beams, large factory windows, leather sofa, edison bulbs, modern industrial design, photorealistic" "1024x1024"

gen style-luxury "Luxury penthouse interior, marble floors, gold accents, crystal chandelier, velvet furniture, panoramic city view, high-end real estate, photorealistic render" "1024x1024"

gen style-minimal "Minimalist zen Japanese interior, tatami, low furniture, neutral tones, single orchid, shoji screens, wabi sabi, calm, photorealistic" "1024x1024"

gen portfolio-kitchen "Photorealistic 3D render of a modern luxury kitchen, island, marble countertop, designer cabinets, pendant lights, architectural visualization" "1024x1024"

gen portfolio-bathroom "Photorealistic 3D render of a luxury modern bathroom, freestanding tub, marble walls, rain shower, designer fixtures, spa atmosphere, architectural visualization" "1024x1024"

echo "=== ALL DONE ==="
ls -la /home/z/my-project/public/images/
