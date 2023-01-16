<template>
    <div>
        <div class="d-flex flex-wrap justify-center">
            <div v-for="(stakeholder, index) in stakeholders" :key="stakeholder.name">
                <Stakeholder :stakeholder="stakeholder" @delete-stakeholder="deleteStakeholder(index)"/>
            </div>
            <v-btn
                    rounded
                    width="220"
                    height="100"
                    class="align-self-center"
                    @click="addingStakeholder = !addingStakeholder"
                    v-show="!addingStakeholder"
                >
                    <v-icon x-large>mdi-plus</v-icon>
            </v-btn>
            <v-card v-show="addingStakeholder" class="pa-0 ma-0">
                    <Stakeholder :stakeholder="newStakeholder"/>
                <v-card-actions>
                    <v-btn
                        @click="cancelNewStakeholder"
                    >
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="addNewStakeholder"
                    >
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<script setup>
    import Stakeholder from './Stakeholder.vue';
    import { ref, computed } from 'vue'
    
    const blankStakeholder = {
        name: "",
        organization: "",
        requestedDate: "",
        completedDate: ""
    };

    const newStakeholder = ref({
        name: "",
        organization: "",
        requestedDate: "",
        completedDate: ""
    });
    
    const addingStakeholder = ref(false);

    const props = defineProps({
        stakeholders: []
    });

    const addNewStakeholder = () => {
        props.stakeholders.push(newStakeholder.value);
        addingStakeholder.value = false;        
        console.log(blankStakeholder);
        newStakeholder.value = blankStakeholder;
        console.log(newStakeholder.value);
    }

    const cancelNewStakeholder = () => {
        addingStakeholder.value = false;
        newStakeholder.value = blankStakeholder;
    }

    const deleteStakeholder = (index) => {
        props.stakeholders.splice(index, 1);
    }

</script>

<style scoped>

</style>