# Sounds Directory

This directory contains placeholder files for the sound effects used in the Planet Clicker game.

## Sound Files

1. **click.mp3** - Plays when the planet is clicked
2. **purchase.mp3** - Plays when a planet or upgrade is purchased
3. **upgrade.mp3** - Plays when an upgrade is purchased

## Implementation Notes

The sound system is already integrated into the game code. To add actual sound files:

1. Replace the placeholder .txt files with actual .mp3 or .wav files
2. Uncomment the audio initialization code in the `initAudio()` method in `src/script.js`
3. Update the `playSound()` method to actually play the audio files

## Sound Settings

Users can enable/disable sounds through the settings panel in the game:
- Sound effects toggle
- Music toggle (for background music, if added)