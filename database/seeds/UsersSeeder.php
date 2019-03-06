<?php

use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $superadmin = new \Carpentree\Core\Models\User([
            'first_name' => 'Mega',
            'last_name' => 'Direttore',
            'email' => 'megadirettore@carpentree.com',
            'password' => \Illuminate\Support\Facades\Hash::make('fakepassword01')
        ]);

        $superadmin->save();

        $superadmin->assignRole('Super Admin');
    }
}
