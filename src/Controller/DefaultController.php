<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DefaultController extends AbstractController{
    

    /**
     * Display index page
     * 
     * @Route("/", name="index")
     * @return Response
     */
    public function index(){
        return $this->render('Default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }
}


?>