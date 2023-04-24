<template>
    <div>        
        <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    :value="formattedDate(dateConst)"
                    class="my-2"
                    dense
                    clearable
                    :label="labelProp"
                    :prepend-icon="iconProp"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    @click:clear="deleteDate"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="dateConst"
                @input="selectDate($event)"
            ></v-date-picker>
        </v-menu>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import dayjs from 'dayjs';

    const props = defineProps({
        dateProp: String,
        labelProp: String,
        iconProp: {
            type: String,
            default: 'mdi-calendar-blank'
        },
        returnISODate: {
            type: Boolean,
            default: true
        }
    });

    // Data
    const dateMenu = ref(false);
    
    const dateConst = ref(dayjs(props.dateProp).isValid() ? dayjs(props.dateProp).format('YYYY-MM-DD').toString() : '');

    const deleteDialog = ref(false);

    // Computed

    const formattedDate = (date) => {
        return computed(() => dayjs(date).isValid() ? dayjs(date).format('M/D/YYYY').toString() : '');
    }

    const deleteDate = () => {
        // props.dateProp = null;
        emit('update-date', null);
    }

    const selectDate = (date) => {
        dateMenu.value = false;
        deleteDialog.value = false;
        // props.dateProp = dayjs(date).toISOString();
        emit('update-date', props.returnISODate ? dayjs(date).toISOString() : dayjs(date).format('MM/DD/YYYY'));
    }
    const emit = defineEmits(['update-date']);
</script>

<style scoped>

</style>