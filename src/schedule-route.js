const express = require('express');
const ScheduleService = require('./schedule-service');
const { v4: uuidv4 } = require('uuid');
const authenticateJWT = require('./auth-jwt')


const scheduleRouter = express.Router();
const jsonParser = express.json();

scheduleRouter
    .route('/api/schedule')
    .post(jsonParser, authenticateJWT, (req, res, next) => {
        const { userId, service, startDate, endDate } = req.body;
        const newSchedule = ScheduleService.serializeSchedule(userId, uuidv4(), service, startDate, endDate)
        console.log(newSchedule.scheduled_date)
        ScheduleService.validateSchedule(
            req.app.get('db'),
            newSchedule.scheduled_date
        )
            .then(hasScheduleWithDate => {
                if (hasScheduleWithDate) {
                console.log(hasScheduleWithDate)
                return res.status(400).json({ error: 'Timeslot already taken, please choose a different time'})}
            
                else {
                    // authenticateJWT(req.get('Authorization').split(' ')[1])
                    ScheduleService.insertSchedule(
                        req.app.get('db'),
                        newSchedule
                    )

                }
            
            }
                )
       
    })
    .get(authenticateJWT, (req, res, next) => {
        const user = req.header('user');
        ScheduleService.getScheduleByUserId(
            req.app.get('db'),
            user
        )
        .then(schedule => {
            res.json(schedule)
        })
        .catch(next)
    })
    .delete(jsonParser, authenticateJWT, (req, res, next) => {
        const sched = req.header('sched');
        ScheduleService.deleteSchedule(
            req.app.get('db'),
            sched
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })


module.exports = scheduleRouter;