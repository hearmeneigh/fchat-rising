<template>
  <div class="eicon-selector-ui">
    <div v-if="!store || refreshing" class="d-flex align-items-center loading">
      <strong>Loading...</strong>
      <div class="spinner-border ml-auto" role="status" aria-hidden="true"></div>
    </div>
    <div v-else tabindex="0">
      <div>
        <div class="search-bar">
          <input type="text" class="form-control search" id="search" v-model="search" ref="search" placeholder="Search eicons..." @click.prevent.stop="setFocus()" @mousedown.prevent.stop @mouseup.prevent.stop />
          <div class="btn-group search-buttons">
            <div class="btn expressions" @click.prevent.stop="runSearch('category:expressions')" aria-label="Expressions">
              <i class="fas fa-theater-masks"></i>
            </div>

            <div class="btn sexual" @click.prevent.stop="runSearch('category:sexual')" aria-label="Sexual">
              <i class="fas fa-heart"></i>
            </div>

            <div class="btn bubbles" @click.prevent.stop="runSearch('category:bubbles')" aria-label="Speech bubbles">
              <i class="fas fa-comment"></i>
            </div>

            <div class="btn actions" @click.prevent.stop="runSearch('category:symbols')" aria-label="Symbols">
              <i class="fas fa-icons"></i>
            </div>

            <div class="btn memes" @click.prevent.stop="runSearch('category:memes')" aria-label="Memes">
              <i class="fas fa-poo"></i>
            </div>

            <div class="btn random" @click.prevent.stop="runSearch('category:random')" aria-label="Random">
              <i class="fas fa-random"></i>
            </div>

            <div class="btn refresh" @click.prevent.stop="refreshIcons()" aria-label="Refresh eicons">
              <i class="fas fa-sync"></i>
            </div>
          </div>
        </div>

        <div class="courtesy">
          Courtesy of <a href="https://xariah.net/eicons">xariah.net</a>
        </div>

        <div class="upload">
          <a href="https://www.f-list.net/icons.php">Upload eicons</a>
        </div>
      </div>

      <div class="carousel slide w-100 results">
        <div class="carousel-inner w-100" role="listbox">
          <div class="carousel-item" v-for="eicon in results" role="img" :aria-label="eicon">
            <img class="eicon" :alt="eicon" :src="'https://static.f-list.net/images/eicon/' + eicon + '.gif'" :title="eicon" @click.prevent.stop="selectIcon(eicon)">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Hook, Prop, Watch } from '@f-list/vue-ts';
import Vue from 'vue';
import { EIconStore } from '../learn/eicon/store';

@Component
export default class EIconSelector extends Vue {
  @Prop
  readonly onSelect?: (eicon: string) => void;

  store: EIconStore | undefined;
  results: string[] = [];

  search: string = '';

  refreshing = false;

  searchUpdateDebounce = _.debounce(() => this.runSearch(), 200, { maxWait: 1000 });

  @Hook('mounted')
  async mounted(): Promise<void> {
    this.store = await EIconStore.getSharedStore();
    this.runSearch('');
  }

  @Watch('search')
  searchUpdate() {
    this.searchUpdateDebounce();
  }

  runSearch(search?: string) {
    if (search) {
      this.search = search;
    }

    const s = this.search.toLowerCase().trim();

    if (s.substring(0, 9) === 'category:') {
      const category = s.substring(9).trim();

      if (category === 'random') {
        this.results = _.map(this.store?.random(100), (e) => e.eicon);
      } else {
        this.results = this.getCategoryResults(category);
      }
    } else {
      if (s.length === 0) {
        this.results = _.map(this.store?.random(100), (e) => e.eicon);
      } else {
        this.results = _.map(_.take(this.store?.search(s), 100), (e) => e.eicon);
      }
    }
  }

  getCategoryResults(category: string): string[] {
    switch(category) {
      case 'expressions':
        return ['coolemoji', 'coughing emoji', 'flushedemoji', 'eyerollemoji', 'laughingemoji', 'grinning emoji', 'party emoji', 'pensiveemoji', 'lipbite emoji', 'nauseous emoji', 'angryemoji', 'facialemoji', 'clapemoji', 'heart eyes', 'kissing heart', 'cowboy emoji', 'cowemoji', 'eggplantemoji', 'peachemoji', 'melting emoji', 'poopemoji', 'thinkingemoji', 'triumphemoji', 'uwuemoji', 'voremoji', 'skullemoji', 'smugemoji', 'heartflooshed', 'fluttersorry', 'snake emoji', 'horseeyes', 'thehorse', 'catblob', 'catblobangery', 'splashemoji', 'tonguemoji', 'blobhugs', 'lickscreen', 'eyes emoji', 'nerdmeme', 'horsepls', 'e62pog', 'thirstytwi', 'bangfingerbang', 'chefs kiss', 'excuse me', 'psychopath', 'ashemote3', 'whentheohitsright', 'caradrinkreact', 'lip_bite', 'twittersob'];

      case 'symbols':
        return ['loveslove', 'pimpdcash', 'pls stop', 'gender-female', 'gender-male', 'gendershemale', 'gender-cuntboy', 'gender-mherm', 'gender-transgender', 'usflag', 'europeflag', 'lgbt', 'transflag', 'yaoilove', 'sunnyuhsuperlove', 'discovered', 'thbun', 'cuckquean', 'goldendicegmgolddicegif', 'pentagramo', 'sexsymbol', 'idnd1', 'instagram', 'twitterlogo', 'snapchaticon', 'tiktok', 'uber', 'google', 'suitclubs', 'suitdiamonds', 'suithearts', 'suitspades'];

      case 'bubbles':
        return ['takemetohornyjail', 'notcashmoney', 'lickme', 'iacs', 'imahugeslut', 'fuckyouasshole', 'bubblecute', 'pat my head', 'chorse', 'knotslutbubble', 'toofuckinghot', 'pbmr', 'imabimbo', 'dicefuck', 'ciaig', 'horseslut', 'fatdick', 'tomboypussy', 'breakthesubs', 'fuckingnya', 'iltclion', 'suckfuckobey', 'shemale', 'breedmaster', 'imastepfordwife', 'prier ahegao', 'buttslutbb', 'notgayoranything', 'onlyfans', 'horsecockneed', 'crimes', 'breed143', 'nagagross', 'willrim', 'muskslut', '4lewdbubble', 'thatslewd', 'hypnosiss', 'imahypnoslut', 'sheepsass2', 'imahugeslut', 'ratedmilf', 'notahealslut', 'ratedstud', 'ratedslut', 'xarcuminme', '5lewdbubble', 'xarcumonme', 'choke me', 'iamgoingtopunchyou', 'snapmychoker', 'rude1', 'fuckbun', 'iamindanger', 'fuckingelves', 'slutmug', 'helpicantstopsuckingcocks', 'talkpooltoy', 'thatskindahot', 'simpbait',];

      case 'sexual':
        return ['kissspink', 'paytonkiss', 'coralbutt4', 'slavefidget', 'capstrip', 'pinkundress', 'jhab1', 'caninelover', 'pole', 'rorobutt2', 'fingerlick', 'lapgrind', 'jackthighs', 'a condom', 'wolf abs', 'musclefuck2', 'verobutt3', 'bumsqueeze', 'realahegao4', 'influencerhater', 'assfucker', 'gagged2', 'ballsack3', 'fingering wolf', 'sloppy01', 'sybian', 'femboibate1', 'floppyhorsecock', 'blackshem1', 'fingersucc', 'vullylick', 'freyasuckfingers', 'cmontakeit', 'jessi flash', 'poju-butt', 'cheegrope2', 'patr1', 'ahega01 2', 'handjob1nuke', 'harmanfingers', 'rorysheath2', 'hermione1', '2buttw1', 'dropsqueeze', 'lixlove', 'bbctitjob6', 'appreciativetease', 'bimbolick', 'subj3', 'salivashare', 'ballsworship3', 'wolfsknot2', 'gaykiss', 'slurpkiss', 'absbulge', 'cockiss', 'horsedick11', 'knot1', 'g4ebulge', 'blackadamrough', 'flaunt', 'cummiefj', 'lovetosuck', 'worship', 'hopelessly in love', 'knotts', 'cockloveeee', 'donglove', 'woowyknotjob', 'cummz', 'every drop', 'edgyoops', 'orccummies2', 'oralcreampie100px', 'horseoral9a', 'swallowit', 'sinahegao', 'gayicon2', 'slut4', 'hossspurties2', 'cumringgag', 'jillbimbogiffell2', 'artistry01'];

      case 'memes':
        return ['guncock', 'michaelguns', 'wegotabadass', 'gonnabang', 'flirting101', 'monkeymeme', 'monkeymeme2', 'horsenoises', 'nyancat', 'gayb', 'fortasshole', 'dickletsign', 'sausageface', 'siren0', 'apologize to god', 'jabbalick', 'zeldawink', 'whatislove', 'surprisemothafucka', 'females', 'thanksihateit'];
    }

    return [];
  }

  selectIcon(eicon: string): void {
    if (this.onSelect) {
      this.onSelect(eicon);
    }
  }

  async refreshIcons(): Promise<void> {
    this.refreshing = true;

    await this.store?.update();
    await this.runSearch();

    this.refreshing = false;
  }

  setFocus(): void {
    (this.$refs['search']  as any).focus();
    (this.$refs['search']  as any).select();
  }
}
</script>

<style lang="scss">
  .eicon-selector-ui {
    .loading {

    }

    .search-bar {
      display: flex;

      .search {
        flex: 1;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .search-buttons {
        margin-left: -1px;

        .btn {
          border-bottom: 1px solid var(--secondary);
        }

        .expressions {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }

        .refresh {

        }

      }
    }

    .courtesy {
      position: absolute;
      bottom: 5px;
      font-size: 9px;
      right: 10px;
      opacity: 50%;
    }

    .upload {
      position: absolute;
      bottom: 5px;
      font-size: 9px;
      left: 10px;
    }

    .results {
      max-height: 200px;
      overflow: hidden;
      margin-top: 5px;

      .carousel-inner {
        overflow-x: scroll;
        overflow-y: hidden;

        .carousel-item {
          display: table-cell;
          border: solid 1px transparent !important;

          &:hover {
            background-color: var(--secondary) !important;
            border: solid 1px var(--gray-dark) !important;
          }

          img {
            width: auto;
            height: auto;
            max-height: 75px;
          }
        }
      }
    }
  }
</style>
