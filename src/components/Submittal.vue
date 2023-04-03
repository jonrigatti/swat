<template>
    <div>
        <v-card shaped>
            <v-card-title class="cyan pa-2">
                <h2>{{ submittal.submittalID }}</h2>
                <v-spacer></v-spacer>
                <v-btn icon @click="(v) => expanded = !expanded" >
                    <v-icon class="toggleUpDown" :class='{ "rotate": !expanded }'>mdi-chevron-up</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="submittal.description" label="Description"></v-text-field>
                <v-text-field v-model="submittal.owner" label="Owner"></v-text-field>
                <v-container>
                    <v-row>
                        <v-col>
                            <Datepicker :dateProp="submittal.needDate" labelProp="Need Date" iconProp="mdi-calendar-clock" @update-date="(date) => submittal.needDate = date" />
                        </v-col>
                        <v-col>
                            <Datepicker :dateProp="submittal.dispositionDate" labelProp="Disposition Date" iconProp="mdi-calendar-check" @update-date="(date) => submittal.dispositionDate = date" />
                        </v-col>
                    </v-row>
                </v-container>
                <div>
                    Priority:
                    <PriorityMenu :submittalProp="submittal" />
                </div>
            </v-card-text>
            <v-card class="py-1" v-if="expanded">
                <v-card-title class="pa-2">Stakeholders</v-card-title>
                <v-card-text>
                    <Stakeholders :stakeholders="submittal.stakeholders" />
                </v-card-text>
            </v-card>
            <v-card class="py-1" v-if="expanded">
                <v-card-title class="pa-2">Violations</v-card-title>
                <v-card-text>
                    <Violations :violations="submittal.violations" @add-violation="addViolation($event, index)" />
                </v-card-text>
            </v-card>
            <v-card-actions class="grey darken-4">
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    @click="saveSubmittal(submittal)"
                >
                <v-icon>mdi-content-save-edit</v-icon>
                </v-btn>
                <v-btn
                    icon
                    @click="createSDF(submittal)"
                >
                <v-icon>mdi-archive-plus</v-icon>
                </v-btn>
                <v-btn
                    icon
                    @click="createPDF(submittal)"
                >
                <v-icon>mdi-file-pdf-box</v-icon>
                </v-btn>
                <v-btn
                    icon
                    @click="mergePDF(submittal)"
                >
                <v-icon>mdi-vector-combine</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
    import Stakeholder from './Stakeholder.vue';
    import Stakeholders from './Stakeholders.vue';
    import Violations from './Violations.vue';;
    import Datepicker from './Datepicker.vue'
    import PriorityMenu from './PriorityMenu.vue';
    import draggable from 'vuedraggable';
    import { useSubmittalsStore } from '../stores/SubmittalsStore';
    import { useProjectsStore } from '../stores/ProjectsStore';
    import ServerDataService from '../services/ServerDataService';
    import { ref, computed } from 'vue';

    const props = defineProps({
        submittal: {}
    });

    const submittals = useSubmittalsStore();

    const projects = useProjectsStore();

    // Data
    const expanded = ref(false);
    const drag = ref(false);

    // Methods
    const saveSubmittal = (submittal) => {
        // console.log('Submittals: ' + JSON.stringify(submittal));
        submittals.updateSubmittal(submittal);
    }

    const addViolation = (violation, index) => {
        submittals.submittals.find(submittal => submittal._id === filteredSubmittals.value[index]._id).violations.push(violation);
    }

    const createSDF = (submittal) => {
    // console.log('Submittals: ' + JSON.stringify(submittal))
    // emit('create-SDF', submittal)

    ServerDataService.createSDF(submittal._id, submittal)
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    const createPDF = (submittal) => {
    ServerDataService.createPDF(submittal._id, submittal)
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    // emit('create-PDF', submittal)
    }

    const mergePDF = (submittal) => {
    ServerDataService.mergePDF(submittal._id, submittal)
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    // emit('merge-PDF', submittal)
    }

    const testDirectory = () => {
        ServerDataService.testDir()
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }
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
.toggleUpDown {
    transition: transform .3s ease-in-out !important;  
}
.toggleUpDown.rotate {
    transform: rotate(180deg);
}
</style>