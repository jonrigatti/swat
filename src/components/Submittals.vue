<template>
  <div>
    <template>
      <v-container fluid>
        <v-row v-if="app.submittalSearch">
          <v-col class="pa-0 ma-0" cols="12">
            <SubmittalSearch />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-iterator
              :items="filteredSubmittals"
              item-key="_id"
              :items-per-page.sync="itemsPerPage"
              :page.sync="page"
              :search="search"
              :sort-by="sortBy"
              :sort-desc="sortDesc"
              hide-default-footer
              v-if="app.submittalView === 'cards'"
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
                    label="Filter"
                  ></v-text-field>
                  <template>
                    <v-spacer></v-spacer>
                    <v-select
                      v-model="sortBy"
                      flat
                      solo-inverted
                      hide-details
                      :items="keys"
                      prepend-inner-icon="mdi-sort"
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
                    v-model="submittalFilter.coreType"
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
                    @click="() => submittalFilter.coreType = coreTypes"
                  >
                    All
                  </v-btn>                
                  <v-btn
                    dense
                    color="red darken-3"
                    @click="() => submittalFilter.coreType = []"
                  >
                    None
                  </v-btn>
                  <v-btn-toggle
                    v-model="submittalFilter.owner"
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
                  <v-btn-toggle
                    dense
                    background-color="primary"
                    multiple
                  >                    
                  <v-btn
                      dense
                      color="grey darken-3"
                      @click="submittalFilter2.peerReviewNeeded = !submittalFilter2.peerReviewNeeded"
                    >
                      Peer Review Needed
                    </v-btn>
                    <v-btn
                      dense
                      color="grey darken-3"
                      @click="submittalFilter2.nrInformed = !submittalFilter2.nrInformed"
                    >
                      NR Informed
                    </v-btn>
                    <v-btn
                      dense
                      color="grey darken-3"
                      @click="submittalFilter2.open = !submittalFilter2.open"
                    >
                      Open
                    </v-btn>
                  </v-btn-toggle>
                </v-toolbar>
              </template>

              <template v-slot:default="{ items }">
                <v-row>
                  <v-col
                    v-for="(item) in items"
                    :key="item._id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    
                  >
                    <Submittal :submittal="item" />
                  </v-col>
                </v-row>
              </template>
              <template v-slot:footer>
                <v-row
                  class="mt-2"
                  align="center"
                  justify="center"
                >
                  <span class="grey--text">Items per page</span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        text
                        color="primary"
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ itemsPerPage }}
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(number, index) in itemsPerPageArray"
                        :key="index"
                        @click="updateItemsPerPage(number)"
                      >
                        <v-list-item-title>{{ number }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-spacer></v-spacer>

                  <span
                    class="mr-4
                    grey--text"
                  >
                    Page {{ page }} of {{ numberOfPages }}
                  </span>
                  <v-btn
                    fab
                    dark
                    color="blue darken-3"
                    class="mr-1"
                    @click="formerPage"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    dark
                    color="blue darken-3"
                    class="ml-1"
                    @click="nextPage"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-data-iterator>
            </v-col>
          </v-row>
      </v-container>
    </template>

    <v-container fluid class="py-0 my-0" v-if="app.submittalView === 'table'">
      <v-data-table
        :headers="headers"
        :items="filteredSubmittals"
        item-key="submittalID"
        :sort-by="['submittalID', 'owner']"
        :sort-desc="[false, true]"
        multi-sort
        show-expand
        :expanded.sync="expanded"
      >
        <template v-slot:item.description="props">
          <v-edit-dialog
            :return-value.sync="props.item.description"
          >
            {{ props.item.description }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.description"
                :rules="[maxchars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>          
        </template>

        <template v-slot:item.needDate="{ item }">
          <Datepicker :dateProp="item.needDate" iconProp="mdi-calendar-clock" @update-date="(date) => item.needDate = date" />
        </template>
        
        <template v-slot:item.dispositionDate="{ item }">
          <Datepicker :dateProp="item.dispositionDate" iconProp="mdi-calendar-check" @update-date="(date) => item.dispositionDate = date" />
        </template>

        <template v-slot:item.priority="{ item }">  
          <PriorityMenu :submittalProp="item" />
        </template>

        <template v-slot:item.save="{ item }">
          <v-btn
            icon
            @click="saveSubmittal(item)"
          >
            <v-icon>mdi-content-save-edit</v-icon>
          </v-btn>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-0 ma-0">
            <v-card-title class="pa-2">Stakeholders</v-card-title>
            <Stakeholders :stakeholders="item.stakeholders" view="table" />            
            <v-card-title class="pa-2">Violations</v-card-title>
            <Violations :violations="item.violations" />
          </td>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>


<!-- https://terabytetiger.com/lessons/moving-from-vue-2-to-vue-3-composition-api -->
<script setup>
  import Submittal from './Submittal.vue';
  import Stakeholders from './Stakeholders.vue';
  import Violations from './Violations.vue';
  import Datepicker from './Datepicker.vue';
  import PriorityMenu from './PriorityMenu.vue';
  import SubmittalSearch from './SubmittalSearch.vue';
  import draggable from 'vuedraggable';
  import { useSubmittalsStore } from '../stores/SubmittalsStore';
  import { useProjectsStore } from '../stores/ProjectsStore';
  import { useAppStore } from '../stores/AppStore';
  import { ref, computed } from 'vue';
  import filter from 'lodash/filter';

  const submittals = useSubmittalsStore();

  const projects = useProjectsStore();

  const app = useAppStore();

  // console.log(JSON.stringify(projects.projects));

  // Data
  // const props = defineProps({
  //       submittalview: {
  //           type: String,
  //           default: 'cards'
  //         }
  //   });

  const itemsPerPageArray = [5, 10, 20, 100];
  const search = ref('');
  const submittalFilter = ref({
    coreType: ['A', 'B', 'C', 'D'],
    owner: []
  });  
  const submittalFilter2 = ref({
    peerReviewNeeded: false,
    nrInformed: false,
    open: false
  });
  const sortDesc = ref(false);
  const page = ref(1);
  const itemsPerPage = ref(10);
  const sortBy = ref('submittalID');
  const keys = [
    { text: 'Submittal ID', value: 'submittalID' },
    { text: 'Need Date', value: 'needDate' },
    { text: 'Owner', value: 'owner' },
    { text: 'Contract', value: 'contract' }
  ];
  const expanded = ref([]);
  const singleExpand = ref(false);
  const maxchars = v => v.length <= 200 || 'Input too long!';
  const pagination = ref({});
  const headers = [
    { text: 'Submittal', align: 'start', value: 'submittalID', width: '140px' },
    { text: 'Description', value: 'description' },
    { text: 'Need Date', value: 'needDate', width: '185px' },
    { text: 'Disposition Date', value: 'dispositionDate', width: '185px' },
    { text: 'Priority', value: 'priority' },
    { text: 'Owner', value: 'owner' },
    { text: '', value: 'save', sortable: false},
    { text: '', value: 'data-table-expand' }
  ];
  const coreTypes = [
    'A',
    'B',
    'C',
    'D'
  ];
  const owners = [
    'Blahsievsky',
    'Blaherson',
    'McBlah',
  ];
  
  const drag = false;

  // Methods
  const saveSubmittal = (submittal) => {
        // console.log('Submittals: ' + JSON.stringify(submittal));
        submittals.updateSubmittal(submittal);
    }

  const selectAllNone = (prop, allNone) => {
    if(allNone = 'all')
    {
      submittalFilter.value[prop] = prop
    }
    else
    {
      submittalFilter.value.prop = []
    }
  };

  const nextPage = () => {
        if (page.value + 1 <= numberOfPages.value) page.value += 1
      };
  const formerPage = () => {
        if (page.value - 1 >= 1) page.value -= 1
      };
  const updateItemsPerPage = (number) => {
        itemsPerPage.value = number
      };

  // Computed
  
  const numberOfPages = computed(() => {
        return Math.ceil(filteredSubmittals.value.length / itemsPerPage.value)
      });

  const filteredSubmittals = computed(() => {

    return submittals.submittals.filter((s) => {
      var someArray = [];
      for(const key in submittalFilter.value){
        someArray.push(submittalFilter.value[key].some((i) => {
          return s[key] === i;
        }));
      }

      var everyArray = [];
      for(const key in submittalFilter2.value){
        if(submittalFilter2.value[key]) {
          everyArray.push(s[key] === submittalFilter2.value[key])
        }
        // console.log(submittalFilter2.value[key]);
      }

      return [someArray.some(sA => sA)].concat(everyArray).every(e => e);
    });


  });  
</script>

<style scoped>
  .v-select.fit {
    width: min-content;
  }
  .v-select.fit  .v-select__selection--comma {
      text-overflow: unset;
  }
</style>