<template>
  <div style="display: flex;flex-direction:column;height:100%" :class="getThemeClass()" @auxclick.prevent>
    <div v-html="styling"></div>
    <div style="display:flex;align-items:stretch;border-bottom-width:1px" class="border-bottom" id="window-tabs">
      <h4 style="padding:2px 0">F-Chat</h4>
      <div style="flex:1;display:flex;justify-content:flex-end;-webkit-app-region:drag" class="btn-group"
           id="windowButtons">
        <i class="far fa-window-minimize btn btn-light" @click.stop="minimize()"></i>
        <i class="far btn btn-light" :class="'fa-window-' + (isMaximized ? 'restore' : 'maximize')" @click="maximize()"></i>
        <span class="btn btn-light" @click.stop="close()">
                    <i class="fa fa-times fa-lg"></i>
                </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from '@f-list/vue-ts';
import * as remote from '@electron/remote';
import Vue from 'vue';
import l from '../chat/localize';
import {GeneralSettings} from './common';
import fs from "fs";
import path from "path";

const browserWindow = remote.getCurrentWindow();
    @Component
    export default class BrowserOption extends Vue {
      settings!: GeneralSettings;
      isMaximized = false;
      l = l;
      platform = process.platform;
      hasCompletedUpgrades = false;

      get styling(): string {
        try {
          return `<style>${fs.readFileSync(path.join(__dirname, `themes/${this.settings.theme}.css`), 'utf8').toString()}</style>`;
        } catch(e) {
          if((<Error & {code: string}>e).code === 'ENOENT' && this.settings.theme !== 'default') {
            this.settings.theme = 'default';
            return this.styling;
          }
          throw e;
        }
      }

      minimize(): void {
        browserWindow.minimize();
      }

      maximize(): void {
        if(browserWindow.isMaximized()) browserWindow.unmaximize();
        else browserWindow.maximize();
      }

      close(): void {
        browserWindow.close();
      }

      getThemeClass() {
        // console.log('getThemeClassWindow', this.settings?.risingDisableWindowsHighContrast);

        try {
          // Hack!
          if (process.platform === 'win32') {
            if (this.settings?.risingDisableWindowsHighContrast) {
              document.querySelector('html')?.classList.add('disableWindowsHighContrast');
            } else {
              document.querySelector('html')?.classList.remove('disableWindowsHighContrast');
            }
          }

          return {
            ['platform-' + this.platform]: true,
            disableWindowsHighContrast: this.settings?.risingDisableWindowsHighContrast || false
          };
        } catch (err) {
          return {
            ['platform-' + this.platform]: true
          };
        }
      }

    }
</script>

<style lang="scss">
  #windowButtons .btn {
    border-top: 0;
    font-size: 14px;
  }

  .platform-darwin {
    #windowButtons .btn, #settings {
      display: none;
    }

    #window-tabs {
      h4 {
        margin: 0 15px 0 77px;
      }

      .btn, li a {
        padding-top: 6px;
        padding-bottom: 6px;
      }
    }
  }

  .disableWindowsHighContrast, .disableWindowsHighContrast * {
    forced-color-adjust: none;
  }
</style>
