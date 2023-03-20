<template>
    <div>
        <v-toolbar dark color="grey darken-4" class="mb-1">
            <v-btn-toggle
                v-model="projectsToggle"
                dense
                background-color="primary"
                dark
                multiple
            >
                <v-btn v-for="project in projects.projects" :key="project.name" :value="project.name">
                    {{ project.name }}
                </v-btn>
            </v-btn-toggle>
        </v-toolbar>

        <v-container fluid>
            <v-card rounded v-for="project in projects.projects" :key="project.name" class="ma-2" v-show="projectsToggle.includes(project.name)">
                <v-card-title class="purple darken-3 pa-4 ma-0">
                    <h1>{{project.name}}</h1>                  
                </v-card-title>
                <v-card-subtitle class="pa-2 ma-2"> 
                    {{ project.prioritySubmittals.length + project.unrankedSubmittals.length }} submittals
                </v-card-subtitle>
                <v-container fluid>
                <v-row>
                    <v-col cols="6" align-self="start">
                    <draggable v-model="project.prioritySubmittals" :group="project.name + 'Submittals'" draggable=".item" handle=".handle" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                        <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->

                            <!-- It's actually dragging the one under whatever is selected... -->
                            
                        <v-card-subtitle class="py-0">Priority Submittals</v-card-subtitle>
                        <v-card v-for="(s, index) in project.prioritySubmittals" :key="s.submittalID" class="item draggable-item mb-2">
                            <v-card-title class="py-1 handle">{{ index + 1 }}. {{s.submittal.submittalID }}</v-card-title>
                            <v-card-subtitle class="pt-5 pb-1">{{ s.submittal.description }}</v-card-subtitle>
                            <v-card-text class="py-0 my-0">
                                <v-text-field single-line v-model="s.driver" cols="8" label="Priority driver" class="mx-6" @change="sortUpdate(project)"></v-text-field>
                            </v-card-text>
                        </v-card>
                        <!-- </transition-group> -->
                    </draggable>
                    </v-col>
                    <v-col cols="6" align-self="start">
                    <draggable v-model="project.unrankedSubmittals" :group="project.name + 'Submittals'" draggable=".item" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                        <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
                        <v-card-subtitle class="py-0">Unranked Submittals</v-card-subtitle>
                        <v-card v-for="s in project.unrankedSubmittals" :key="s.submittal.submittalID" class="item draggable-item mb-2">
                            <v-card-title class="py-1 handle">{{s.submittal.submittalID }}</v-card-title>
                            <v-card-subtitle class="pt-5 pb-1">{{ s.submittal.description }}</v-card-subtitle>
                        </v-card>
                        <!-- </transition-group> -->
                    </draggable>
                    </v-col>
                </v-row>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script setup>
    import draggable from 'vuedraggable';
    import { useSubmittalsStore } from '../stores/SubmittalsStore'
    import { useProjectsStore } from '../stores/ProjectsStore'
    import { ref } from 'vue'

    const submittals = useSubmittalsStore();

    const projects = useProjectsStore();

    const projectsToggle = ref(projects.projects.map(p => p.name));

    const sortUpdate = (project) => {
        // console.log('priority: ' + JSON.stringify(project.prioritySubmittals));
        // console.log('unranked: ' + JSON.stringify(project.unrankedSubmittals));

        projects.updateSubmittalPriorities(project);
        // emit('update-submittal-priorities', project)
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