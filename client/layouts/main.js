import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import './main.html';
import { Machines } from '../../imports/api/machines/machines.js';
Template.mainLayout.rendered = function(){


    // Minimalize menu when screen is less than 768px
    $(window).bind("resize load", function () {
        if ($(this).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    });

    // Fix height of layout when resize, scroll and load
    $(window).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {

            var navbarHeigh = $('nav.navbar-default').height();
            var wrapperHeigh = $('#page-wrapper').height();

            if(navbarHeigh > wrapperHeigh){
                $('#page-wrapper').css("min-height", navbarHeigh + "px");
            }

            if(navbarHeigh < wrapperHeigh){
                $('#page-wrapper').css("min-height", $(window).height()  + "px");
            }

            if ($('body').hasClass('fixed-nav')) {
                if (navbarHeigh > wrapperHeigh) {
                    $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
                } else {
                    $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
                }
            }
        }
    });


    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated)
    // $('body').addClass('skin-1');

    // FIXED-SIDEBAR
    // Uncomment this if you want to have fixed left navigation
    // $('body').addClass('fixed-sidebar');
    // $('.sidebar-collapse').slimScroll({
    //     height: '100%',
    //     railOpacity: 0.9
    // });

    // BOXED LAYOUT
    // Uncomment this if you want to have boxed layout
    // $('body').addClass('boxed-layout');

    // more elegant solution here: subscribe to all data, but only monitor added new data
    // insert newly added data to session, and the entire template/sub template can just feed off session variables
    const startTime = new Date(new Date().setDate(new Date().getDate()-1));
    // set startTime so the subsciption will only limit data to within the last day(24hrs)
    // a bit tricky here to do datetime caculation, I've decided to save everything datetime in JS BSON objects 
    // using startTime as a subscription argument, the publication should only return everything within the last 24 hrs
    this.subscribe('meterData', startTime, function(){
        let initializing = true;
            Machines.find().observeChanges({
                added: function(id, doc) {
                    if (!initializing) {
                        // console.log(doc)
                        Session.set({
                            'ts': doc.ts,
                            'v12': doc.message.v12,
                            'fq': doc.message.fq,
                            'apower': doc.message.apower,
                            'current': doc.message.current
                        });
                    }
                }
            });
        initializing = false;

    });
};


