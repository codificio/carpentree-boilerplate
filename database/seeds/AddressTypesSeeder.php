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
            'en' => ['name' => 'Home'],
            'it' => ['name' => 'Casa']
        ];

        $dataBusiness = [
            'en' => ['name' => 'Business'],
            'it' => ['name' => 'Business']
        ];

        $dataBilling = [
            'en' => ['name' => 'Billing'],
            'it' => ['name' => 'Fatturazione']
        ];

        $dataShipping = [
            'en' => ['name' => 'Shipping'],
            'it' => ['name' => 'Spedizione']
        ];

        Type::create($dataHome);
        Type::create($dataBusiness);
        Type::create($dataBilling);
        Type::create($dataShipping);
    }
}
