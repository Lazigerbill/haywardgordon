import './dataCard.html';
import { Moment } from 'moment';
import { Machines } from '../../api/machines/machines.js';

Template.dataCard.onCreated(function() {

})

Template.dataCard.helpers({
    ts() {
        return moment(Session.get('ts')).calendar();
    },
    v12() {
        return Session.get('v12').toFixed(3);
    },
    fq() {
        return Session.get('fq').toFixed(2);
    },
    apower() {
        return Session.get('apower').toFixed(3);
    },
    current() {
        return Session.get('current').toFixed(3);
    }
});