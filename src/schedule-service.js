const knex = require('knex');

const ScheduleService = {
    getScheduleByScheduleId(knex, schedule_id) {
        return knex('schedule')
        .where({ schedule_id })
    },
    getScheduleByUserId(knex, user_id) {
        return knex('schedule')
        .where({ user_id })
    },
    insertUser(knex, newSchedule) {
        return knex
        .insert(newSchedule)
        .into('schedule')
        .returning('schedule_id')
        .then(rows => {
            return rows[0]
        })
    },
    updateUser(knex, schedule_id, updateSchedule) {
        return knex('schedule')
        .where({ schedule_id })
        .update(updateSchedule)
    },
    deleteUser(knex, schedule_id) {
        return knex('schedule')
        .where({ schedule_id })
        .delete()
    }
}

module.exports = ScheduleService;