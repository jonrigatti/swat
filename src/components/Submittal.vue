<template>
    <div>
        <v-card shaped>
            <v-card-title class="cyan pa-1 ma-0">
                <h2>{{ submittal.submittalID }}</h2>
            <v-spacer></v-spacer>
            <v-btn icon @click="(v) => expanded = !expanded" >
                <v-icon class="toggleUpDown" :class='{ "rotate": !expanded }'>mdi-chevron-up</v-icon>
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
                        v-model="submittal.needDate">
                    </v-text-field>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>Disposition Date:</v-list-item-content>
                    <v-list-item-content class="align-end">
                    <v-text-field
                        v-model="submittal.dispositionDate">
                    </v-text-field>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>Owner:</v-list-item-content>
                    <v-list-item-content class="align-end">
                    <v-text-field
                        v-model="submittal.owner">
                    </v-text-field>
                    </v-list-item-content>
                </v-list-item> 
                </v-list>
                <div>Contract: {{ submittal.contract }}</div>
                <div>
                Priority:
                <span v-for="project in projects.projects" :key="project._id" v-show="project.prioritySubmittals.findIndex(s => { return s.submittal._id === submittal._id }) != -1">
                    <v-menu
                        offset-y
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="ma-2"
                            v-bind="attrs"
                            v-on="on"
                        >
                            {{ project.name }} - {{ project.prioritySubmittals.findIndex(s => { return s.submittal._id === submittal._id }) + 1}}
                        </v-btn>
                        </template>
                        <v-card>
                            <draggable v-model="project.prioritySubmittals" :group="project.name + 'Submittals'" draggable=".item" handle=".handle" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                            <v-col v-for="(s, index) in project.prioritySubmittals" :key="s.submittal._id" :class="s.submittal._id === submittal._id ? 'item draggable-item handle' : 'item nondraggable-item'">
                                {{ index + 1 }}. {{s.submittal.submittalID}}
                            </v-col>
                            </draggable>
                        </v-card>
                    </v-menu>
                </span>
                </div>
            </v-form>
            <v-divider v-if="expanded"></v-divider>                    
            <Violations :violations="submittal.violations" v-if="expanded" @add-violation="addViolation($event, index)" />
            <v-card-actions>
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
    import Violations from './Violations.vue';
    import draggable from 'vuedraggable';
    import { useSubmittalsStore } from '../stores/SubmittalsStore'
    import { useProjectsStore } from '../stores/ProjectsStore'
    import ServerDataService from '../services/ServerDataService'
    import { ref, computed } from 'vue'

    const props = defineProps({
        submittal: {}
    });

    const submittals = useSubmittalsStore();
    // submittals.getSubmittals();

    const projects = useProjectsStore();
    // projects.getProjects();

    // console.log(JSON.stringify(projects.projects));

    // Data
    const expanded = ref(false);

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

    const saveSubmittal = (submittal) => {
        // console.log('Submittals: ' + JSON.stringify(submittal));
        submittals.updateSubmittal(submittal);
    }

    const addViolation = (violation, index) => {
        submittals.submittals.find(submittal => submittal._id === filteredSubmittals.value[index]._id).violations.push(violation);
    }

    const sortUpdate = (project) => {
        // console.log('priority: ' + JSON.stringify(project.prioritySubmittals));
        // console.log('unranked: ' + JSON.stringify(project.unrankedSubmittals));

        projects.updateSubmittalPriorities(project);
        // emit('update-submittal-priorities', project)
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