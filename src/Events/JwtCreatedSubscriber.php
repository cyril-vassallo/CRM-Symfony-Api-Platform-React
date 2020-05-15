<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber{

    /**
     * This function add two user information to the token
     * It is call by the service.yaml of symfony
     * It receive an event with the request inside
     *
     * @param JWTCreatedEvent $event
     * @return void
     */
    public function updateJwtData(JWTCreatedEvent $event)
    {
        
        $user = $event->getUser(); // event contain the user
        $data = $event->getData(); // access to payload array
        $data['firstName'] = $user->getFirstName(); //add first name to data
        $data['lastName'] = $user->getLastName(); // add last name to data
        $event->setData($data); // set new data array to the payload of request
    }

}