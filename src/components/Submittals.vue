<template>
  <div>
    <!-- <div :key="submittal.id" v-for="submittal in submittals">
      <Submittal
        :submittal="submittal"
        @delete-submittal="$emit('delete-submittal', submittal.id)"
        @toggle-priority="$emit('toggle-priority', submittal.id)"
      />
    </div> -->

    <template>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row>
                <v-data-iterator
                  :items="queryFields"
                  item-key="key"
                  :single-expand="singleExpand"
                  hide-default-footer
                >
                  <template v-slot:default="{ items }">
                    <v-row
                      v-for="item in items"
                      :key="item.key"
                      no-gutters
                    >
                      <v-col>
                        <v-select v-model="item.andOr" :items="['and', 'or']" class="fit pa-1 ma-1"></v-select>
                      </v-col>
                      <v-col>
                        <v-select v-model="item.operator" item-text="text" item-value="value" :items="queryOperatorOptions" class="fit pa-1 ma-1"></v-select>    
                      </v-col>
                      <v-col cols="4">
                        <v-select v-model="item.key" label="Search field" item-text="text" item-value="value" :items="queryKeyOptions" class="pa-1 ma-1"></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field v-model="item.value" label="Value" class="pa-1 ma-1"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-btn @click="deleteQueryField(items.indexOf(item))">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-row>
              <v-row>
                <v-btn @click="addQueryField">Add field</v-btn>
                <v-btn @click="getDynamicQuery" v-show="queryFields.length > 0">Search!</v-btn>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-iterator
              :items="filteredSubmittals"
              item-key="submittalID"
              :items-per-page.sync="itemsPerPage"
              :page.sync="page"
              :search="search"
              :sort-by="sortBy"
              :sort-desc="sortDesc"
              hide-default-footer
            >
              <template v-slot:header>
                <v-toolbar dark color="purple darken-3" class="mb-1">
                  <v-text-field
                    v-model="search"
                    clearable
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                  ></v-text-field>
                  <template>
                    <v-spacer></v-spacer>
                    <v-select
                      v-model="sortBy"
                      flat
                      solo-inverted
                      hide-details
                      :items="keys"
                      prepend-inner-icon="mdi-magnify"
                      label="Sort by"
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="sortDesc" mandatory>
                      <v-btn large depressed color="blue" :value="false">
                        <v-icon>mdi-arrow-up</v-icon>
                      </v-btn>
                      <v-btn large depressed color="blue" :value="true">
                        <v-icon>mdi-arrow-down</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </template>
                </v-toolbar>
                <v-toolbar dark color="blue darken-3" class="mb-1">
                  <v-btn-toggle
                    v-model="filter.coreType"
                    dense
                    background-color="primary"
                    dark
                    multiple
                  >
                    <v-btn
                      color="purple"
                      v-for="core in coreTypes"
                      :key="core"
                      :value="core"
                    >
                      {{ core }}
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn
                    dense
                    color="red darken-3"
                    @click="() => filter.coreType = coreTypes"
                  >
                    All
                  </v-btn>                
                  <v-btn
                    dense
                    color="red darken-3"
                    @click="() => filter.coreType = []"
                  >
                    None
                  </v-btn>
                  <v-btn-toggle
                    v-model="filter.owner"
                    dense
                    background-color="primary"
                    dark
                    multiple
                  >
                    <v-btn
                      color="green"
                      v-for="owner in owners"
                      :key="owner"
                      :value="owner"
                    >
                      {{ owner }}
                    </v-btn>
                  </v-btn-toggle>
                  {{ filter.coreType }}
                  {{ filter.owner }}
                </v-toolbar>
              </template>

              <template v-slot:default="{ items, isExpanded, expand }">
                <v-row>
                  <v-col
                    v-for="(item, index) in items"
                    :key="item.submittalID"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card shaped>
                      <v-card-title class="cyan pa-1 ma-0">
                        <h2>{{ item.submittalID }}</h2>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="(v) => expand(item, !isExpanded(item))">
                          <v-icon>{{ isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                        </v-btn>
                      </v-card-title>
                        <v-form>
                          <v-list
                            dense
                          >
                            <v-list-item>
                              <v-list-item-content>Need Date:</v-list-item-content>
                              <v-list-item-content class="align-end">
                                <v-text-field
                                  v-model="item.needDate">
                                </v-text-field>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>Disposition Date:</v-list-item-content>
                              <v-list-item-content class="align-end">
                                <v-text-field
                                  v-model="item.dispositionDate">
                                </v-text-field>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>Owner:</v-list-item-content>
                              <v-list-item-content class="align-end">
                                <v-text-field
                                  v-model="item.owner">
                                </v-text-field>
                              </v-list-item-content>
                            </v-list-item> 
                          </v-list>
                          <div>Contract: {{ item.contract }}</div>
                          <div>
                            Priority:
                            <!-- v-show="project.prioritySubmittals.findIndex(submittal => { return submittal._id === item._id }) != -1" -->
                            <span v-for="project in projects" :key="project" v-show="project.prioritySubmittals.findIndex(s => { return s.submittal._id === item._id }) != -1">
                                <v-menu
                                  offset-y
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      class="ma-2"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      {{ project.name }} - {{ project.prioritySubmittals.findIndex(s => { return s.submittal._id === item._id }) + 1}}
                                    </v-btn>
                                  </template>
                                    <v-card>
                                      <draggable v-model="project.prioritySubmittals" :group="project.name + 'Submittals'" draggable=".item" handle=".handle" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                                        <v-col v-for="(s, index) in project.prioritySubmittals" :key="s.submittal" :class="s.submittal.submittalID === item.submittalID ? 'item draggable-item handle' : 'item'">
                                          {{ index + 1 }}. {{s.submittal.submittalID}}
                                        </v-col>
                                      </draggable>
                                    </v-card>
                                </v-menu>
                            </span>
                          </div>
                        </v-form>
                        <v-divider v-if="isExpanded(item)"></v-divider>                    
                        <Violations :violations="item.violations" v-if="isExpanded(item)" @add-violation="addViolation($event, index)" />
                        <v-card-actions>
                          <v-btn
                            icon
                            @click="saveSubmittal(item)"
                          >
                            <v-icon>mdi-content-save-edit</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            @click="createSDF(item)"
                          >
                            <v-icon>mdi-archive-plus</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            @click="createPDF(item)"
                          >
                            <v-icon>mdi-file-pdf-box</v-icon>
                          </v-btn>
                        </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
            </v-col>
          </v-row>
      </v-container>
    </template>

    <v-card v-for="project in projects" :key="project.name" class="pa-2 ma-2" width="500">
      <v-card-title>{{project.name}}</v-card-title>
      <v-container fluid>
      <v-row>
        <v-col cols="6" align-self="start">
          <!-- <v-col v-for="submittal in sortedItems(project.prioritySubmittals, ['priority', 'submittalID'])" :key="submittal.submittalID">{{ submittal.priority }} - {{ submittal.submittalID }}</v-col> -->

          <draggable v-model="project.prioritySubmittals" :group="project.name + 'Submittals'" draggable=".item" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
            <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
              <v-card-subtitle slot="header">Priority Submittals</v-card-subtitle>
              <v-col v-for="(s, index) in project.prioritySubmittals" :key="s.submittalID" class="item draggable-item">
                {{ index + 1 }}. {{s.submittal.submittalID }} - {{ s.submittal.description }} - {{ s.driver }}
              </v-col>
            <!-- </transition-group> -->
          </draggable>
        </v-col>
        <v-col cols="6" align-self="start">
          <!-- <v-col v-for="submittal in sortedItems(project.prioritySubmittals, ['priority', 'submittalID'])" :key="submittal.submittalID">{{ submittal.priority }} - {{ submittal.submittalID }}</v-col> -->
          <draggable v-model="project.unrankedSubmittals" :group="project.name + 'Submittals'" draggable=".item" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
            <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
              <v-card-subtitle slot="header">Unranked Submittals</v-card-subtitle>
              <v-col v-for="s in project.unrankedSubmittals" :key="s.submittal.submittalID" class="item draggable-item">
                {{ s.submittal.submittalID }} - {{ s.submittal.description }}
              </v-col>
            <!-- </transition-group> -->
          </draggable>
        </v-col>
      </v-row>
      </v-container>
    </v-card>

    <v-container fluid class="my-1">
      <v-data-table
        :headers="headers"
        :items="filteredSubmittals"
        :sort-by="['submittalID', 'owner']"
        :sort-desc="[false, true]"
        multi-sort
        show-expand
        :expanded.sync="expanded"
      >
        <template v-slot:item.submittalID="props">
          <v-edit-dialog
            :return-value.sync="props.item.submittalID"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.submittalID }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.submittalID"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>          
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            More info about {{ item.submittalID }}
          </td>
        </template>

        <template v-slot:item.priority="{ item }">
        <v-simple-checkbox
          v-model="item.priority"
        ></v-simple-checkbox>
      </template>
      </v-data-table>

      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}
        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" text @click="snack = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
// import Submittal from "./Submittal.vue";
import Violations from "./Violations.vue";
import _ from 'lodash';
import draggable from 'vuedraggable';

export default {
  name: "Submittals",
  props: {
    submittals: Array,
    projects: Array
  },
  data(){
    return {
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {
        coreType: [],
        owner: []
      },
      sortDesc: false,
      page: 1,
      itemsPerPage: 10,
      sortBy: '',
      keys: [
        'Submittal ID',
        'Need Date',
      ],
      expanded: [],
      singleExpand: false,
      snack: false,
      snackColor: '',
      snackText: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
      pagination: {},
      // items: [
      // 'Blah',
      // 'Bobloblaw',
      // 'Meh'
      // ],
      headers: [
        {
          text: 'Submittal',
          align: 'start',
          value: 'submittalID',
        },
        { text: 'Need Date', value: 'needDate' },
        { text: 'Owner', value: 'owner' },
        { text: 'Priority', value: 'priority' },
        { text: '', value: 'data-table-expand' }
      ],
      coreTypes: [
        'A',
        'B',
        'C',
        'D'
      ],
      owners: [
        'Blahsievsky',
        'Blaherson',
        'McBlah',
      ],
      queryFields: [],
      queryKeyOptions: [        
        {
          text: "Submittal ID",
          value: {
            name: "submittalID",
            type: "String"
            }
        },
        {
          text: "Submittal description",
          value: {
            name: "description",
            type: "String"
            }
        },
        {
          text: "Submittal need date",
          value: {
            name: "needDate",
            type: "Date"
            }
        },
        {
          text: "Submittal received date",
          value: {
            name: "receivedDate",
            type: "Date"
            }
        },
        {
          text: "Submittal disposition date",
          value: {
            name: "dispositionDate",
            type: "Date"
            }
        },
        {
          text: "Submittal owner",
          value: {
            name: "owner",
            type: "String"
            }
        },
        {
          text: "Violation category",
          value: {
            name: "violations.category",
            type: "String"
            }
        },
        {
          text: "Violation limit",
          value: {
            name: "violations.limit",
            type: "Number"
            }
        },
        {
          text: "Violation actual",
          value: {
            name: "violations.actual",
            type: "Number"
            }
        },
        {
          text: "Violation reference",
          value: {
            name: "violations.reference",
            type: "String"
            }
        }
      ],
      queryOperatorOptions: [        
        {
          text: "=",
          value: "$eq"
        },
        {
          text: ">",
          value: "$gt"
        },
        {
          text: ">=",
          value: "$gte"
        },
        {
          text: "<",
          value: "$lt"
        },
        {
          text: "<=",
          value: "$lte"
        },
        {
          text: "!=",
          value: "$ne"
        }
      ],
      drag: false
    }
  },
  computed: {
    numberOfPages(){
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys(){
      return this.keys.filter(key => key !== 'Name')
    },
    filteredSubmittals(){
      var myArray = this.submittals;
      var myFilter = this.filter;
      // for(const key in myFilter){
      //   console.log(key)
      // }

      return myArray.filter(function(s){
        var boolArray = []
        for(const key in myFilter){
          boolArray.push(myFilter[key].some(function(i){
            return s[key] === i
          }))
        }
        return boolArray.some(b => b)
      })      
    },
    allSelected(){
      if(this.filter.coreType == this.coreType)
      {
        return true
      }
      else {
        return false
      }
    }
  },
  methods: {
    save(){
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel(){
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open(){
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close(){
      console.log('Dialog closed')
    },
    selectAllNone(prop, allNone)
    {
      if(allNone = "all")
      {
        this.filter[prop] = prop
        // console.log(prop)
        // console.log(this.filter[prop])     
      }
      else
      {
        this.filter.prop = []
      }
    },
    saveSubmittal(submittal){
      // console.log('Submittals: ' + JSON.stringify(submittal))
      this.$emit('update-submittal', submittal)
    },
    addViolation(violation, index){
      this.submittals.find(submittal => submittal._id === this.filteredSubmittals[index]._id).violations.push(violation)
    },
    addQueryField(){
      if(this.queryFields.length == 0 || this.queryFields[this.queryFields.length - 1].value != ''){
        this.queryFields.push({ key: '', value: '', andOr: 'and', operator: '$eq' })
      }
    },
    deleteQueryField(index){
      console.log('Index: ' + index)
      console.log(this.queryFields)
      this.queryFields.splice(index, 1)      
      console.log(this.queryFields)
    },
    getDynamicQuery(){
      this.$emit('dynamic-query', this.queryFields)
    },
    sortedItems(items, sortKeys){
      return _.sortBy(items, sortKeys)
    },
    sortUpdate(project){
      console.log('priority: ' + JSON.stringify(project.prioritySubmittals))
      console.log('unranked: ' + JSON.stringify(project.unrankedSubmittals))
      this.$emit('update-submittal-priorities', project)
    },
    createSDF(submittal){
      // console.log('Submittals: ' + JSON.stringify(submittal))
      this.$emit('create-SDF', submittal)
    },
    createPDF(submittal){
      this.$emit('create-PDF', submittal)
    }
  },
  components: {
    // Submittal,
    Violations,
    draggable
  },
  emits: ["delete-submittal", "update-submittal","dynamic-query", "create-SDF", "create-PDF"]
};
</script>

<style scoped>
  .v-select.fit {
    width: min-content;
  }
  .v-select.fit  .v-select__selection--comma {
      text-overflow: unset;
  }

  .handle {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
  }
  .draggable-item {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
  }
  .ghost {
  opacity: 0.5;
  background: darkcyan;
}
  .flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>