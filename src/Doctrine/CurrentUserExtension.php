<?php
namespace App\Doctrine;

use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * This class is an extension that affect somme specific Doctrine Query from original
 * applyToCollection and applyToItem method are called just before execute the 
 * current queryBuilder
 * 
 * @implement QueryCollectionExtensionInterface
 * @implement QueryItemExtensionInterface
 */
 class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface 
 {

   /**
    * Contain the current logged user
    *
    * @var Security
    *
    */
   private $security;

   /**
    * @var AuthorizationCheckerInterface
    *
    * Contain the checker that give current user role
    */
   private $auth;

   /**
    * Inject in this class two dependency
    *
    * @param Security $security
    * @param AuthorizationCheckerInterface $checker
    */
   public function __construct(Security $security, AuthorizationCheckerInterface $checker)
   {
      $this->security = $security;
      $this->auth = $checker; 
   }


   /**
    * Modify the queryBuilder for Invoice and Customer Queries
    * Link Invoice and Customer to the current user
    *
    * @param QueryBuilder $queryBuilder
    * @param string $resourceClass
    * @return void
    */
   private function addWhere(QueryBuilder $queryBuilder,string $resourceClass){

      // 1 . obtenir l'utilisateur connecté
      $user = $this->security->getUser();

      //verify if the curent asked ressource is Invoice or Customer and if the user is not admin and if $user is an instance of User.
      if (($resourceClass === Invoice::class || $resourceClass === Customer::class)
         && 
         !$this->auth->isGranted('ROLE_ADMIN')
         &&
         $user instanceof User) {
         // 2 . Si on demande des Invoice ou des Customer, agir sur la requête pour quelle tienne compte de l'utilisateur connecté.

         //Alias set by Doctrine represent asked ressource for exemple: 'Select from o from Invoice as o' . The first alias is the first Table.
         $rootAlias = $queryBuilder->getRootAliases()[0];

         //We check what query Doctrine Just received
         if ($resourceClass === Customer::class) {
            //we add new condition to the current query
            $queryBuilder->andWhere("$rootAlias.user = :user");
         } else if ($resourceClass === Invoice::class) {
            //otherwise we add other condition to the current query, a join is needed so set user from and Invoice
            $queryBuilder->join("$rootAlias.customer", "c")
               ->andWhere("c.user = :user");
         }
         //we set queryBuilder user alias to the current user
         $queryBuilder->setParameter("user", $user);
      }
      
   }


   /**
    * Implements QueryCollectionExtensionInterface 
    * Modify queryBuilder for a collection of item
    *
    * @param QueryBuilder $queryBuilder
    * @param QueryNameGeneratorInterface $queryNameGenerator
    * @param string $resourceClass
    * @param string|null $operationName
    * @return void
    */
   public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
   {
      $this->addWhere($queryBuilder, $resourceClass);
   }

   /**
    * Implements QueryItemExtensionInterface
    * Modify queryBuilder for one item
    *
    * @param QueryBuilder $queryBuilder
    * @param QueryNameGeneratorInterface $queryNameGenerator
    * @param string $resourceClass
    * @param array $identifiers
    * @param string $operationName
    * @param array $context
    * @return void
    */
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
      $this->addWhere($queryBuilder, $resourceClass);
    }

 }