const express = require('express');
const ScheduleService = require('./schedule-service');
const { v4: uuidv4 } = require('uuid');

const scheduleRouter = express.Router();
const jsonParser = express.json();

scheduleRouter
    .route('/api/addschedule')
    .post((req, res, next) => {
        const { userId, service, startDate, endDate } = req.body;
        console.log(userId);
        ScheduleService.insertSchedule(
            req.app.get('db'),
            ScheduleService.serializeSchedule(userId, uuidv4(), service, startDate, endDate )
        )
    })

module.exports = scheduleRouter;