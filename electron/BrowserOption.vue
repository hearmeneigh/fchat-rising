<template>
  <div style="display: flex;flex-direction:column;height:100%" :class="getThemeClass()" @auxclick.prevent>
    <div v-html="styling"></div>
    <div style="display:flex;align-items:stretch;border-bottom-width:1px" class="border-bottom" id="window-browser-settings">
      <h4 style="padding:2px 0">{{l('settings.browserOptionTitle')}}</h4>
      <div style="flex:1;display:flex;justify-content:flex-end;-webkit-app-region:drag" class="btn-group"
           id="windowButtons">
        <i class="far fa-window-minimize btn btn-light" @click.stop="minimize()"></i>
        <i class="far btn btn-light" :class="'fa-window-' + (isMaximized ? 'restore' : 'maximize')" @click="maximize()"></i>
        <span class="btn btn-light" @click.stop="close()">
                    <i class="fa fa-times fa-lg"></i>
                </span>
      </div>
    </div>
    <div style="display:flex; flex-direction: column; height:100%; justify-content: center">
      <div class="card bg-light" style="width:100%;margin:0 auto">
        <div class="card-body">
          <h4 class="card-title">Hello</h4>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Hook} from '@f-list/vue-ts';
import * as remote from '@electron/remote';
import Vue from 'vue';
import l from '../chat/localize';
import {GeneralSettings} from './common';
import fs from "fs";
import path from "path";
import Modal from "../components/Modal.vue";
import tabs from "../components/tabs";
import modal from "../components/Modal.vue";
import core from "../chat/core";
import BBCodeParser from "../chat/bbcode";
import logs from "../chat/Logs.vue";
import chat from "../chat/ChatView.vue";

const browserWindow = remote.getCurrentWindow();
@Component({
  components: {chat, logs, modal, tabs, Modal}
})
export default class BrowserOption extends Vue {
  settings!: GeneralSettings;
  isMaximized = false;
  l = l;
  platform = process.platform;
  hasCompletedUpgrades = false;
  browserPath = '';
  browserArgs = '';

  get styling(): string {
    console.log("HELLO");
    try {
      return `<style>${fs.readFileSync(path.join(__dirname, `themes/${this.settings.theme}.css`), 'utf8').toString()}</style>`;
    } catch (e) {
      if ((<Error & { code: string }>e).code === 'ENOENT' && this.settings.theme !== 'default') {
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
    if (browserWindow.isMaximized()) browserWindow.unmaximize();
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

  async load(): Promise<void> {
    this.browserPath = this.settings.browserPath;
    this.browserArgs = this.settings.browserArgs;
  }

  async submit(): Promise<void> {
    this.settings.browserPath = this.browserPath;
    this.settings.browserArgs = this.browserArgs;
  }
}
</script>

<style lang="scss">
  #windowButtons .btn {
    border-top: 0;
    font-size: 14px;
  }

  #window-browser-settings {
    user-select: none;
    .btn {
      border: 0;
      border-radius: 0;
      padding: 0 18px;
      display: flex;
      align-items: center;
      line-height: 1;
      -webkit-app-region: no-drag;
      flex-grow: 0;
    }

    .btn-default {
      background: transparent;
    }

    h4 {
      margin: 0 10px;
      user-select: none;
      cursor: default;
      align-self: center;
      -webkit-app-region: drag;
    }

    .fa {
      line-height: inherit;
    }
  }


  .disableWindowsHighContrast, .disableWindowsHighContrast * {
    forced-color-adjust: none;
  }
</style>
