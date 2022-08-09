<template>
    <sidebar id="user-list" :label="l('users.title')" icon="fa-users" :right="true" :open="expanded">
        <tabs style="flex-shrink:0" :tabs="channel ? [l('users.friends'), l('users.members')] : [l('users.friends')]" v-model="tab"></tabs>
        <div class="users" style="padding-left:10px" v-show="tab === '0'">
            <h4>{{l('users.friends')}}</h4>
            <div v-for="character in friends" :key="character.name">
                <user :character="character" :showStatus="true" :bookmark="false"></user>
            </div>
            <h4>{{l('users.bookmarks')}}</h4>
            <div v-for="character in bookmarks" :key="character.name">
                <user :character="character" :showStatus="true" :bookmark="false"></user>
            </div>
        </div>
        <div v-if="channel" style="padding-left:5px;flex:1;display:flex;flex-direction:column" v-show="tab === '1'">
            <div class="users" style="flex:1;padding-left:5px">
                <h4>{{l('users.memberCount', channel.sortedMembers.length)}} <a class="btn sort" @click="switchSort"><i class="fa fa-sort"></i></a></h4>
                <div v-for="member in filteredMembers" :key="member.character.name">
                    <user :character="member.character" :channel="channel" :showStatus="true"></user>
                </div>
            </div>
            <div class="input-group" style="margin-top:5px;flex-shrink:0">
                <div class="input-group-prepend">
                    <div class="input-group-text"><span class="fas fa-search"></span></div>
                </div>
                <input class="form-control" v-model="filter" :placeholder="l('filter')" type="text"/>
            </div>
        </div>
    </sidebar>
</template>

<script lang="ts">
    import {Component} from '@f-list/vue-ts';
    import Vue from 'vue';
    import Tabs from '../components/tabs';
    import core from './core';
    import { Channel, Character, Conversation } from './interfaces';
    import l from './localize';
    import Sidebar from './Sidebar.vue';
    import UserView from './UserView.vue';
    import _ from 'lodash';

    type StatusSort = {
      [key in Character.Status]: number;
    };

    type GenderSort = {
      [key in Character.Gender]: number;
    };

    const statusSort: StatusSort = {
      'crown': 0,
      'looking': 1,
      'online': 2,
      'idle': 3,
      'away': 4,
      'busy': 5,
      'dnd': 6,
      'offline': 7
    };

    const genderSort: GenderSort = {
      'Female': 0,
      'Male': 1,
      'Herm': 2,
      'Shemale': 3,
      'Cunt-boy': 4,
      'Transgender': 5,
      'Male-Herm': 6,
      'None': 7
    };

    const availableSorts = ['normal', 'status', 'gender'] as const;

    @Component({
        components: {user: UserView, sidebar: Sidebar, tabs: Tabs}
    })
    export default class UserList extends Vue {
        tab = '0';
        expanded = window.innerWidth >= 992;
        filter = '';
        l = l;
        sorter = (x: Character, y: Character) => (x.name < y.name ? -1 : (x.name > y.name ? 1 : 0));

        sortType: typeof availableSorts[number] = 'normal';

        get friends(): Character[] {
            return core.characters.friends.slice().sort(this.sorter);
        }

        get bookmarks(): Character[] {
            return core.characters.bookmarks.slice().filter((x) => core.characters.friends.indexOf(x) === -1).sort(this.sorter);
        }

        get channel(): Channel {
            return (<Conversation.ChannelConversation>core.conversations.selectedConversation).channel;
        }

        get filteredMembers(): ReadonlyArray<Channel.Member> {
          const members = this.getFilteredMembers();

          if (this.sortType === 'normal') {
            return members;
          }

          const sorted = [...members];

          switch (this.sortType) {
            case 'status':
              sorted.sort((a, b) => {
                const aVal = statusSort[a.character.status];
                const bVal = statusSort[b.character.status];

                if (aVal - bVal === 0) {
                  return a.character.name.localeCompare(b.character.name);
                }

                return aVal - bVal;
              });
              break;

            case 'gender':
              sorted.sort((a, b) => {
                const aVal = genderSort[(a.character.gender || 'None')];
                const bVal = genderSort[(b.character.gender || 'None')];

                if (aVal - bVal === 0) {
                  return a.character.name.localeCompare(b.character.name);
                }

                return aVal - bVal;
              });
              break;
          }

          return sorted;
        }

        getFilteredMembers() {
          const members = this.prefilterMembers();

          if (!core.state.settings.risingFilter.hideChannelMembers) {
            return members;
          }

          return members.filter((m) => {
            const p = core.cache.profileCache.getSync(m.character.name);

            return !p || !p.match.isFiltered;
          });
        }

        prefilterMembers(): ReadonlyArray<Channel.Member> {
          const sorted = this.channel.sortedMembers;

          if(this.filter.length === 0)
            return sorted;

          const filter = new RegExp(this.filter.replace(/[^\w]/gi, '\\$&'), 'i');

          return sorted.filter((member) => filter.test(member.character.name));
        }

        switchSort() {
          const nextSortIndex = _.indexOf(availableSorts, this.sortType) + 1;

          this.sortType = availableSorts[nextSortIndex % availableSorts.length];
        }
    }
</script>

<style lang="scss">
    @import "~bootstrap/scss/functions";
    @import "~bootstrap/scss/variables";
    @import "~bootstrap/scss/mixins/breakpoints";

    #user-list {
        flex-direction: column;
        h4 {
            margin: 5px 0 0 -5px;
            font-size: 17px;
        }

        .users {
            overflow: auto;
        }

        .nav li:first-child a {
            border-left: 0;
            border-top-left-radius: 0;
        }

        @media (min-width: breakpoint-min(md)) {
            .sidebar {
                position: static;
                margin: 0;
                padding: 0;
                height: 100%;
            }

            .modal-backdrop {
                display: none;
            }
        }

        &.open .body {
            display: flex;
        }
    }
</style>
