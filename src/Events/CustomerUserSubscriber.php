<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CustomerUserSubscriber implements EventSubscriberInterface{

    /**
     * Security contain a method to get current user
     *
     * @var Security
     */
    private $security;

    /**
     * inject in this class the security dépendency
     *
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
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
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];

    }

    /**
     * This function catch a Kernel Event PRE_VALIDATE
     * and is executed on the event 
     * it will provide to the created Customer the current login User
     * 
     * @param Event $event
     * @return void
     * 
     */
    public function setUserForCustomer(ViewEvent $event){
        //get the current customer on request data
        $customer = $event->getControllerResult();
        //get current request Method
        $method = $event->getRequest()->getMethod();
        
        //check if we have right instance and method before set Customer new user
        if($customer instanceof Customer && $method === "POST" ){
            //get the current user with Security object 
            $user = $this->security->getUser();
            //set the current user to the created customer
            $customer->setUser($user);
        }
    }
}