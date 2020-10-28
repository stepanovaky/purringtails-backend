const knex = require('knex');
const xss = require('xss'),

const ScheduleService = {
    getScheduleByScheduleId(knex, schedule_id) {
        return knex('schedule')
        .where({ schedule_id })
    },
    getScheduleByUserId(knex, user_id) {
        return knex('schedule')
        .where({ user_id })
    },
    insertSchedule(knex, newSchedule) {
        return knex
        .insert(newSchedule)
        .into('schedule')
        .returning('user_id, schedule_id, scheduled_type, scheduled_date, scheduled_end_date')
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
    }, serializeSchedule(userId, scheduledId, scheduledType, scheduledDate, scheduledEndDate='') {
        return {
            user_id: userId,
            scheduled_id: scheduledId,
            scheduled_type: xss(scheduledType), 
            scheduled_date: xss(scheduledDate),
            scheduled_end_date: xss(scheduledEndDate)
        }
    }
}

module.exports = ScheduleService;