<template>
  <div>
    <template>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-container fluid>
              <v-row
                v-for="qf in queryFields"
                :key="qf.id"
                no-gutters
              >
                <v-col>
                  <v-select v-model="qf.andOr" :items="['and', 'or']" class="fit pa-1 ma-1"></v-select>
                </v-col>
                <v-col>
                  <v-select v-model="qf.operator" item-text="text" item-value="value" :items="queryOperatorOptions" class="fit pa-1 ma-1"></v-select>    
                </v-col>
                <v-col cols="4">
                  <v-select v-model="qf.key" label="Search field" item-text="text" item-value="value" :items="queryKeyOptions" class="pa-1 ma-1"></v-select>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="qf.value" label="Value" class="pa-1 ma-1"></v-text-field>
                </v-col>
                <v-col>
                  <v-btn @click="deleteQueryField(items.indexOf(item))">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                </v-col>
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
              item-key="_id"
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
                  {{ submittalFilter.coreType }}
                  {{ submittalFilter.owner }}
                  {{ sortDesc }}
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
            </v-data-iterator>
            </v-col>
          </v-row>
      </v-container>
    </template>

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


<!-- https://terabytetiger.com/lessons/moving-from-vue-2-to-vue-3-composition-api -->
<script setup>
  import Submittal from './Submittal.vue';
  import draggable from 'vuedraggable';
  import { useSubmittalsStore } from '../stores/SubmittalsStore'
  import { useProjectsStore } from '../stores/ProjectsStore'
  import { ref, computed } from 'vue'

  const submittals = useSubmittalsStore();
  submittals.getSubmittals();

  const projects = useProjectsStore();
  projects.getProjects();

  // console.log(JSON.stringify(projects.projects));

  // Data
  const itemsPerPageArray = [4, 8, 12];
  const search = ref('');
  const submittalFilter = ref({
    coreType: [],
    owner: []
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
  const snack = ref(false);
  const snackColor = ref('');
  const snackText = ref('');
  const max25chars = v => v.length <= 25 || 'Input too long!';
  const pagination = ref({});
  // items: [
  // 'Blah',
  // 'Bobloblaw',
  // 'Meh'
  // ],
  const headers = [
    {
      text: 'Submittal',
      align: 'start',
      value: 'submittalID',
    },
    { text: 'Need Date', value: 'needDate' },
    { text: 'Owner', value: 'owner' },
    { text: 'Priority', value: 'priority' },
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
  const queryFields = ref([]);
  const queryKeyOptions = [        
    {
      text: 'Submittal ID',
      value: {
        name: 'submittalID',
        type: 'String'
        }
    },
    {
      text: 'Submittal description',
      value: {
        name: 'description',
        type: 'String'
        }
    },
    {
      text: 'Submittal need date',
      value: {
        name: 'needDate',
        type: 'Date'
        }
    },
    {
      text: 'Submittal received date',
      value: {
        name: 'receivedDate',
        type: 'Date'
        }
    },
    {
      text: 'Submittal disposition date',
      value: {
        name: 'dispositionDate',
        type: 'Date'
        }
    },
    {
      text: 'Submittal owner',
      value: {
        name: 'owner',
        type: 'String'
        }
    },
    {
      text: 'Violation category',
      value: {
        name: 'violations.category',
        type: 'String'
        }
    },
    {
      text: 'Violation limit',
      value: {
        name: 'violations.limit',
        type: 'Number'
        }
    },
    {
      text: 'Violation actual',
      value: {
        name: 'violations.actual',
        type: 'Number'
        }
    },
    {
      text: 'Violation reference',
      value: {
        name: 'violations.reference',
        type: 'String'
        }
    }
  ];
  const queryOperatorOptions = [        
    {
      text: '=',
      value: '$eq'
    },
    {
      text: '>',
      value: '$gt'
    },
    {
      text: '>=',
      value: '$gte'
    },
    {
      text: '<',
      value: '$lt'
    },
    {
      text: '<=',
      value: '$lte'
    },
    {
      text: '!=',
      value: '$ne'
    }
  ];
  const drag = false;

  // Methods
  const save = () => {
    snack.value = true
    snackColor.value = 'success'
    snackText.value = 'Data saved'
  }

  const cancel = () => {
    snack.value = true
    snackColor.value = 'error'
    snackText.value = 'Canceled'
  }

  const open = () => {
    snack.value = true
    snackColor.value = 'info'
    snackText.value = 'Dialog opened'
  }

  const close = () => {
    console.log('Dialog closed')
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
  }

  const addQueryField = () => {
    if(queryFields.value.length == 0 || queryFields.value[queryFields.value.length - 1].value != ''){
      queryFields.value.push({ id: Math.random() * 10000, key: '', value: '', andOr: 'and', operator: '$eq' })
    }
    console.log(JSON.stringify(queryFields));
  }

  const deleteQueryField = (index) => {
    console.log('Index: ' + index)
    console.log(queryFields.value)
    queryFields.value.splice(index, 1)      
    console.log(queryFields.value)
  }

  const getDynamicQuery = () => {
    submittals.getDynamicQuery(queryFields.value);
  }

  const sortUpdate = (project) => {
    // console.log('priority: ' + JSON.stringify(project.prioritySubmittals));
    // console.log('unranked: ' + JSON.stringify(project.unrankedSubmittals));

    projects.updateSubmittalPriorities(project);
    // emit('update-submittal-priorities', project)
  }

  // Computed

  // I don't know what this was supposed to be:

  // const numberOfPages = computed(() => {
  //   return Math.ceil(this.items.length / this.itemsPerPage)
  // });

  const filteredSubmittals = computed(() => {
    var filteredArray = submittals.submittals;

    return filteredArray.filter(function(s){
      var boolArray = [];
      for(const key in submittalFilter.value){
        boolArray.push(submittalFilter.value[key].some(function(i){
          return s[key] === i;
        }));
      }
      return boolArray.some(b => b);
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

  .handle {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
  }
  .draggable-item {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
    user-select: none;
  }
  .nondraggable-item {
    user-select: none;
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