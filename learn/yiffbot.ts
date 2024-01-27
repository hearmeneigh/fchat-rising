import { EventBus } from '../chat/preview/event-bus';
import { Message } from '../chat/common';
import core from '../chat/core';

export function initYiffbot4000Integration() {
  EventBus.$on('private-message', ({ message }: { message: Message }) => {
    if (message.sender.name === 'YiffBot 4000') {
      const match = message.text.match(/\[spoiler](.*?FChatRisingBotManifest.*?)\[\/spoiler]/i);

      if (match && match[1]) {
        try {
          const manifest = JSON.parse(match[1]);

          if (manifest.type === 'FChatRisingBotManifest' && manifest.version >= 1) {
            const char = core.characters.get('YiffBot 4000');

            char.overrides.avatarUrl = manifest.avatarUrl;
            char.overrides.gender = manifest.gender;
          }
        } catch (err) {
          console.error('FChatRisingBotManifest.error', err);
        }
      }
    }
  });
}

