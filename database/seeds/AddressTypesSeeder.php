<?php

use Illuminate\Database\Seeder;

use Carpentree\Core\Models\Address\Type;

class AddressTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dataHome = [
            'name' => 'home',
            'en' => ['label' => 'Home'],
            'it' => ['label' => 'Casa']
        ];

        $dataBusiness = [
            'name' => 'business',
            'en' => ['label' => 'Business'],
            'it' => ['label' => 'Business']
        ];

        $dataBilling = [
            'name' => 'billing',
            'en' => ['label' => 'Billing'],
            'it' => ['label' => 'Fatturazione']
        ];

        $dataShipping = [
            'name' => 'shipping',
            'en' => ['label' => 'Shipping'],
            'it' => ['label' => 'Spedizione']
        ];

        Type::create($dataHome);
        Type::create($dataBusiness);
        Type::create($dataBilling);
        Type::create($dataShipping);
    }
}
