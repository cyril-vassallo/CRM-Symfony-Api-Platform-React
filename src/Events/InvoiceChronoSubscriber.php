<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface{

    /**
     * Security contain a method to get current user
     *
     * @var Security
     */
    private $security;

    /**
     * Contain method to select Invoice with doctrine in  database
     *
     * @var InvoiceRepository
     */
    private $repository;

    /**
     * inject in this class the security dependency and InvoiceRepository
     *
     * @param Security $security
     * @param InvoiceRepository $repository
     */
    public function __construct(Security $security, InvoiceRepository $repository){

        $this->security = $security;
        $this->repository = $repository;

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
     * @return array KernelEvent::VIEW
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE ]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        $invoice = $event->getControllerResult();    
        $method = $event->getRequest()->getMethod();
        if($invoice instanceof Invoice && $method === 'POST'){
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());  
            $invoice->setChrono($nextChrono);

        // to move in  in an other class
        if(empty($invoice->sentAt))
            $invoice->setSentAt(new \DateTime());
        }

    }
    
    public function setDateForInvoice(ViewEvent $event)
    {
        $event->getControllerResult(); 
    }
}

