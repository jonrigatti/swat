<template>
    <div>
        <span v-for="project in isRanked" :key="project._id">
            <v-menu
                offset-y
            >
                <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="ma-2"
                    v-bind="attrs"
                    v-on="on"
                >
                    {{ project.name }} - {{ project.prioritySubmittals.findIndex(s => { return s.submittal._id === submittalProp._id }) + 1}}
                </v-btn>
                </template>
                <v-card>
                    <draggable v-model="project.prioritySubmittals" :group="project.name + 'Submittals'" draggable=".item" handle=".handle" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                        <v-col v-for="(s, index) in project.prioritySubmittals" :key="s.submittal._id" :class="s.submittal._id === submittalProp._id ? 'item cyan darken-4 draggable-item handle' : 'item nondraggable-item'">
                            {{ index + 1 }}. {{s.submittal.submittalID}}
                        </v-col>
                    </draggable>
                </v-card>
            </v-menu>
        </span>

        <span v-for="project in isUnranked" :key="project._id">
            <v-menu
                offset-y
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="ma-2"
                        v-bind="attrs"
                        v-on="on"
                    >
                        {{ project.name }} - Unranked
                    </v-btn>
                </template>
                <v-card>
                    <draggable v-model="project.prioritySubmittals" :group="project.name + 'Submittals'" draggable=".draggable-item" handle=".handle" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                    <v-col v-for="(s, index) in project.prioritySubmittals" :key="s.submittal._id" :class="s.submittal._id === submittalProp._id ? 'item cyan darken-4 draggable-item handle' : 'item nondraggable-item'">
                        {{ index + 1 }}. {{s.submittal.submittalID}}
                    </v-col>
                    </draggable>
                </v-card>

                <v-card>
                    <draggable v-model="project.unrankedSubmittals" :group="project.name + 'Submittals'" draggable=".draggable-item" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                        <v-col v-for="s in project.unrankedSubmittals" :key="s.submittal.submittalID" :class="s.submittal._id === submittalProp._id ? 'item cyan darken-4 draggable-item handle' : 'item nondraggable-item'" v-show="s.submittal._id === submittalProp._id">
                            {{s.submittal.submittalID}}
                        </v-col>
                    </draggable>
                </v-card>
            </v-menu>
        </span>
    </div>
</template>

<script setup>    
    import draggable from 'vuedraggable';
    import { useProjectsStore } from '../stores/ProjectsStore';
    import { ref, computed } from 'vue';

    const props = defineProps({
        submittalProp: {},
    });

    const projects = useProjectsStore();

    const sortUpdate = (project) => {
        // console.log('priority: ' + JSON.stringify(project.prioritySubmittals));
        // console.log('unranked: ' + JSON.stringify(project.unrankedSubmittals));

        projects.updateSubmittalPriorities(project);
        // emit('update-submittal-priorities', project)
    }
    // Data
    // const dateMenu = ref(false);
    
    // const dateConst = ref(dayjs(props.dateProp).isValid() ? dayjs(props.dateProp).format('YYYY-MM-DD').toString() : '');

    // const deleteDialog = ref(false);

    // Computed

    const isRanked = computed(() => {
        var iR = [];
        projects.projects.forEach((project) => {
            if(project.prioritySubmittals.findIndex(s => { return s.submittal._id === props.submittalProp._id }) != -1) {
                iR.push(project);
            }
            // console.log(project);
        });
        return iR;
    });


    const isUnranked = computed(() => {
        var iR = [];
        projects.projects.forEach((project) => {
            if(project.unrankedSubmittals.findIndex(s => { return s.submittal._id === props.submittalProp._id }) != -1) {
                iR.push(project);
            }
            // console.log(project);
        });
        return iR;
    });
    // const deleteDate = () => {
    //     // props.dateProp = null;
    //     emit('update-date', null);
    // }

    // const selectDate = (date) => {
    //     dateMenu.value = false;
    //     deleteDialog.value = false;
    //     // props.dateProp = dayjs(date).toISOString();
    //     emit('update-date', dayjs(date).toISOString());
    // }
    // const emit = defineEmits(['update-date']);
</script>

<style scoped>
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
    cursor: default !important;
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