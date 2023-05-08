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
          <v-col>
              <v-toolbar dark color="purple darken-3" class="mb-1" v-if="app.submittalView==='cards'">
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
              <v-card dark color="blue darken-3" class="d-inline-flex pa-0 mb-1" width="w-100">
                <v-container>
                  <v-row justify="start">
                    <v-col>
                      <v-btn-toggle
                        v-model="projectFilter"
                        dense
                        background-color="primary"
                        dark
                        multiple
                      >
                        <v-btn
                          color="purple"
                          v-for="project in projects.projects"
                          :key="project.name"
                          :value="project.name"
                        >
                          {{ project.name }}
                        </v-btn>
                      </v-btn-toggle>
                      <v-btn
                        dense
                        color="red darken-3"
                        @click="() => projectFilter = ['A', 'B', 'C', 'D']"
                      >
                        All
                      </v-btn>                
                      <v-btn
                        dense
                        color="red darken-3"
                        @click="() => projectFilter = []"
                      >
                        None
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-container>
                        <v-row>
                          <v-btn-toggle
                            v-model="unitSelect"
                            dense
                            background-color="primary"
                            exclusive
                            dark
                          >
                          <v-btn
                            color="yellow darken-3"
                            v-for="unit in units"
                            :key="unit"
                            :value="unit"
                          >
                            {{ unit }}
                          </v-btn>
                        </v-btn-toggle>
                        </v-row>
                        <v-row class="d-inline-flex">
                          <v-item-group
                            v-model="submittalFilter.owner"
                            dense
                            background-color="primary"
                            dark
                          >
                            <v-item
                              v-for="owner in owners.filter(owner => owner.unit === unitSelect)"
                              :key="owner.name"
                              :value="owner.name"
                              v-slot="{ active, toggle }"
                            >
                              <v-btn
                                color="green"
                                class="ma-1 text-capitalize"
                                active-class="black--text"
                                :input-value="active"
                                @click="toggle"
                              >
                                {{ owner.name }}
                              </v-btn>
                            </v-item>
                          </v-item-group>
                        </v-row>
                      </v-container>
                    </v-col>
                    <v-col>
                      <v-btn-toggle
                        dense
                        background-color="primary"
                        exclusive
                        v-model="submittalFilter.peerReviewNeeded"
                      >                    
                      <v-btn
                          dense
                          color="red darken-3"
                          :value="true"
                        >
                          Peer Needed
                        </v-btn>
                        <v-btn
                          dense
                          color="red darken-3"
                          :value="false"
                        >
                          Peer Assigned
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                    <v-col>
                      <v-btn-toggle
                        dense
                        background-color="primary"
                        exclusive
                        v-model="submittalFilter.nrInformed"
                      >                    
                        <v-btn
                          dense
                          color="blue darken-3"
                          :value="true"
                        >
                          NR Informed
                        </v-btn>
                        <v-btn
                          dense
                          color="blue darken-3"
                          :value="false"
                        >
                          NR Uninformed
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                    <v-col>
                      <v-btn-toggle
                        dense
                        background-color="primary"
                        exclusive
                        v-model="submittalFilter.open"
                      >                    
                        <v-btn
                          dense
                          color="orange darken-3"
                          :value="true"
                        >
                          Open
                        </v-btn>
                        <v-btn
                          dense
                          color="orange darken-3"
                          :value="false"
                        >
                          Closed
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                  </v-row>
              </v-container>
              </v-card>
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
                    Page {{ page }} of {{ numberOfPages === 0 ? 1 : numberOfPages }}
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
        :items="submittals.submittals"
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
  // import filter from 'lodash/filter';
  import { filter } from 'smart-array-filter';

  const submittals = useSubmittalsStore();

  const projects = useProjectsStore();

  const app = useAppStore();

  // console.log(JSON.stringify(submittals.submittals));
  console.log(JSON.stringify(projects.projects));

  // Data

  const itemsPerPageArray = [5, 10, 20, 100];
  const search = ref('');
  const unitSelect = ref('');
  const submittalFilter = ref({
    peerReviewNeeded: null,
    nrInformed: null,
    owner: null,
    open: null
  });
  const projectFilter = ref(['A', 'B', 'C', 'D']);
  const sortDesc = ref(false);
  const page = ref(1);
  const itemsPerPage = ref(10);
  const sortBy = ref('submittalID');
  const keys = [
    { text: 'Submittal ID', value: 'submittalID' },
    { text: 'Need Date', value: 'needDate' },
    { text: 'Owner', value: 'owner' },
    // { text: 'Contract', value: 'contract' }
  ];
  const expanded = ref([]);
  const singleExpand = ref(false);
  const maxchars = v => v.length <= 200 || 'Input too long!';
  const pagination = ref({});
  const headers = [
    { text: 'Submittal', align: 'start', value: 'submittalID', width: '140px' },
    { text: 'Description', value: 'description' },
    { text: 'Received Date', value: 'receivedDate', width: '185px' },
    { text: 'Need Date', value: 'needDate', width: '185px' },
    { text: 'Disposition Date', value: 'dispositionDate', width: '185px' },
    { text: 'Priority', value: 'priority' },
    { text: 'Owner', value: 'owner' },
    { text: '', value: 'save', sortable: false},
    { text: '', value: 'data-table-expand' }
  ];
  const units = [
    'AA',
    'BB',
    'CC',
    'DD',
    'EE',
    'FF'
  ];
  const subdivisions = [
    'AAA',
    'BBB',
    'CCC',
  ];
  const owners = [
  {
      name: 'Corbet Camber',
      unit: 'AA',
      subdivision: 'AAA'
    },
    {
      name: 'Benedicto Durn',
      unit: 'AA',
      subdivision: 'AAA'
    },
    {
      name: 'Floyd Salvage',
      unit: 'AA',
      subdivision: 'AAA'
    },
    {
      name: 'Harrietta Hentzer',
      unit: 'AA',
      subdivision: 'AAA'
    },
    {
      name: 'Mason Roobottom',
      unit: 'AA',
      subdivision: 'AAA'
    },
    {
      name: 'Marchelle Haker',
      unit: 'BB',
      subdivision: 'AAA'
    },
    {
      name: 'Stearn Cahalan',
      unit: 'BB',
      subdivision: 'AAA'
    },
    {
      name: 'Hettie Gluyas',
      unit: 'BB',
      subdivision: 'AAA'
    },
    {
      name: 'Walker Ost',
      unit: 'BB',
      subdivision: 'AAA'
    },
    {
      name: 'Thornie Maly',
      unit: 'BB',
      subdivision: 'AAA'
    },
    {
      name: 'Aileen Cartner',
      unit: 'BB',
      subdivision: 'AAA'
    },
    {
      name: 'Valina Cleaver',
      unit: 'CC',
      subdivision: 'BBB'
    },
    {
      name: 'Natal Tilmouth',
      unit: 'CC',
      subdivision: 'BBB'
    },
    {
      name: 'Sebastiano Janes',
      unit: 'CC',
      subdivision: 'BBB'
    },
    {
      name: 'Maurizio Wrates',
      unit: 'CC',
      subdivision: 'BBB'
    },
    {
      name: 'Daloris Roskell',
      unit: 'CC',
      subdivision: 'BBB'
    },
    {
      name: 'Robbyn Morrid',
      unit: 'CC',
      subdivision: 'BBB'
    },
    {
      name: 'Teddy Punt',
      unit: 'CC',
      subdivision: 'BBB'
    },
    {
      name: 'Nessy Streets',
      unit: 'DD',
      subdivision: 'BBB'
    },
    {
      name: 'Michel Mewett',
      unit: 'DD',
      subdivision: 'BBB'
    },
    {
      name: 'Joice Hrynczyk',
      unit: 'DD',
      subdivision: 'BBB'
    },
    {
      name: 'Lavinia Thaxter',
      unit: 'DD',
      subdivision: 'BBB'
    },
    {
      name: 'Doralynne Konerding',
      unit: 'EE',
      subdivision: 'CCC'
    },
    {
      name: 'Concettina Syalvester',
      unit: 'EE',
      subdivision: 'CCC'
    },
    {
      name: 'Tommie Dunmuir',
      unit: 'EE',
      subdivision: 'CCC'
    },
    {
      name: 'Christoffer Kryska',
      unit: 'EE',
      subdivision: 'CCC'
    },
    {
      name: 'Benedikt Gothliff',
      unit: 'EE',
      subdivision: 'CCC'
    },
    {
      name: 'Germayne Wannop',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Maura Burhill',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Phillipe Huckle',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Drusilla Hassin',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Gustavo Liley',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Jessie Arangy',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Georgina Cadagan',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Marthena Brierly',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Kingsly Clymo',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Melany Noddles',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Sibel Peterffy',
      unit: 'FF',
      subdivision: 'CCC'
    },
    {
      name: 'Waldo Locke',
      unit: 'FF',
      subdivision: 'CCC'
    }
  ];
  
  const drag = false;

  // Methods
  const saveSubmittal = (submittal) => {
        // console.log('Submittals: ' + JSON.stringify(submittal));
        submittals.updateSubmittal(submittal);
    }

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

  const contracts = computed(() => {
    var fP = projects.projects.filter(function(e) {
      return projectFilter.value.includes(e.name)
    });

    var contracts = []
    fP.forEach(project => {
      project.contracts.forEach(contract => {
        !contracts.includes(contract.contractID) && contracts.push(contract.contractID);
      });
    });

    // console.log(contracts);

    return contracts;
  })

  const filteredSubmittals = computed(() => {
    var fS = [];

    contracts.value.forEach(contract => {
      fS.push.apply(fS, filter(submittals.submittals, {
        keywords: `submittalID:-${contract}-`
      }));
    });

    Object.entries(submittalFilter.value).forEach(entry => {
      const [key, value] = entry;
      value != null && (fS = fS.filter(submittal => submittal[key]===value));
    });

    return fS;
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