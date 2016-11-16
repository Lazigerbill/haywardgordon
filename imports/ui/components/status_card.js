import './status_card.html';
import { Rules } from '../../api/machines/machines.js';

Template.status_card.helpers({
    state() {
        return Session.get('state');
    }
});