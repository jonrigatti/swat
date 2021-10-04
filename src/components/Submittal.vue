<template>
    <div>
        <div :class="[submittal.priority ? 'priority' : '', 'submittal']"  @dblclick="togglePriority(submittal.id)" >
            <h3>
                {{ submittal.submittalID }}
                <i @click="onDelete(submittal.id)" class="fas fa-times"></i>
            </h3>
            <Dates class="dateBox" :submittal="submittal"/>
            <p>{{ submittal.description }}</p>
            <Stakeholders class="stakeholdersBox" :stakeholders="submittal.stakeholders"/>
        </div>
    </div>
</template>

<script>
    import Dates from './Dates.vue'
    import Stakeholders from './Stakeholders.vue'

    export default {
        name: 'Submittal',
        props: {
            submittal: Object
        },
        components: {
            Dates,
            Stakeholders
        },
        methods: {
            onDelete(id) {
                this.$emit('delete-submittal', id)
            },
            togglePriority(id) {
                this.$emit('toggle-priority', id)
            }        
        }
    }
</script>

<style scoped lang="scss">
    .fas {
        color: red;
    }

    .submittal {
        background: $light-color;
        margin: 5px;
        padding: 10px 20px;
        cursor: pointer;
        float: left;
        min-width: 300px;
    }

    .submittal.priority {
        border-left: 5px solid maroon;
    }

    .submittal h3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .dateBox {
        float: right;
    }

    
    .stakeholdersBox {
        display: inline-block;
    }
</style>