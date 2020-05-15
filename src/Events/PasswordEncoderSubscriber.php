<?php

namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface {

    /**
     * Encoder
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * We inject user an encoder as argument in this class
     *
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * Symfony stop the Http request process 
     * and read all implemented interface methods class relate to HTTPKernel 
     * 
     * This method provide to Symfony an array of a event 
     * contain an array of method to call with priority argument
     * Here we user static classes containing all const we need as :
     *      KernelEvent
     *      EventPriorities
     *
     * @return array KernelEvents::VIEW
     */
    public static function  getSubscribedEvents()    
    {
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE] 
        ];       
    }

    /**
     * This function catch a Kernel Event PRE_WRITE
     * and is executed on the event 
     * it will encode user Password before insert in database
     * 
     * @param Event $event
     * @return void
     */
    public function encodePassword(ViewEvent $event){
        $user = $event->getControllerResult(); //At that moment we don't know if the result is an user
        $method = $event->getRequest()->getMethod(); //we need to determine the request method GET POST PUT ...
        if($user instanceof User && $method == 'POST'){ // We check if serialization give us an user entity and if the method is POST to create a new user
            $hash = $this->encoder->encodePassword($user, $user->getPassword()); // we use an encoder to hash de password
            $user->setPassword($hash); // we modify the User entity and api platform will flush data entity it self
        }
    }
}