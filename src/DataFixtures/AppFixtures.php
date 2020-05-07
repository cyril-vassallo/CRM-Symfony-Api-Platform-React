<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;

    /**
     * Encoder de mont de passe
     *
     * @var UserPasswordEncoderInterface
     */
    public function __construct(UserPasswordEncoderInterface $encoder){
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');


        //User LOOP
        for($u = 0 ; $u < 10 ; $u++){
            
            $user = new User();
            $chrono = 1;
            $hash = $this->encoder->encodePassword($user, "password"); 

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setPassword($hash)
                ->setEmail($faker->email);
            $manager->persist($user);
        //Customer LOOP
            for($c  = 0 ;  $c < mt_rand(5,20) ; $c++){
                $customer = new Customer();
                $customer->setFirstName( $faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user);

                $manager->persist($customer);
        //Invoice LOOP
                for($f = 0 ;  $f < mt_rand(3,10)  ; $f++){
                    $invoice =  new Invoice();
                    $invoice->setAmount($faker->randomFloat(2,200,5000))
                                    ->setSentAt($faker->dateTimeBetween('- 6 month'))
                                    ->setStatus($faker->randomElement(['SENT','PAID','CANCELLED']))
                                    ->setCustomer($customer)
                                    ->setChrono($chrono);
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }
        $manager->flush();
    }
}
