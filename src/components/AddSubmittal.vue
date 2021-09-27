<template>
    <form @submit="onSubmit" class="add-form">
        <div class="form-control">
            <label>Submittal ID</label>
            <input type="text" v-model="submittalID" name="submittalID" placeholder="Submittal ID" />
        </div>
        <div class="form-control">
            <label>Need Date</label>
            <input type="text" v-model="needDate" name="needDate" placeholder="Need Date"
            />
        </div>
        <div class="form-control form-control-check">
            <label>Priority Submittal</label>
            <input type="checkbox" v-model="priority" name="priority" />
        </div>

        <input type="submit" value="Save Submittal" class="btn btn-block" />
    </form>
</template>

<script>
    export default {
        name: 'AddSubmittal',
        data() {
            var date = new Date();
            date.setDate(date.getDate() + 14);
            date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
            return {
                submittalID: '',
                needDate: date,
                priority: false
            }
        },
        methods: {
            onSubmit(e) {
                e.preventDefault()

                if(!this.submittalID) {
                    alert('Please add a submittal.')
                    return
                }

                const newSubmittal = {
                    id: Math.floor(Math.random() * 100000),
                    submittalID: this.submittalID,
                    needDate: this.needDate,
                    priority: this.priority
                }

                this.$emit('add-submittal', newSubmittal)

                this.submittalID = ''
                this.needDate = ''
                this.priority = false
            }
        }
    }
</script>

<style scoped>
    .add-form {
        margin-bottom: 40px;
    }
    .form-control {
        margin: 20px 0;
    }
    .form-control label {
        display: block;
    }
    .form-control input {
        width: 100%;
        height: 40px;
        margin: 5px;
        padding: 3px 7px;
        font-size: 17px;
    }
    .form-control-check {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .form-control-check label {
        flex: 1;
    }
    .form-control-check input {
        flex: 2;
        height: 20px;
    }
</style>