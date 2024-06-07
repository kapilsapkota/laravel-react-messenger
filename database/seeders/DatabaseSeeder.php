<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Kapil Sapkota',
            'email' => 'kapilsapkota1001@gmail.com',
            'password' =>bcrypt('password'),
            'is_admin' => true
        ]);

        User::factory()->create([
            'name' => 'Sandhya Sigdel',
            'email' => 'sandhyasigdel173@gmail.com',
            'password' =>bcrypt('password'),
        ]);

        User::factory(10)->create();
        $this->command->info('Users Seeded');

        for ($fun = 1; $fun <= 10; $fun++){
            $group = Group::factory()->create(['owner_id' => 1]);
            $users = User::inRandomOrder()->limit(rand(2,10))->pluck('id');
            $group->users()->attach(array_unique([1, ...$users]));
        }
        $this->command->info('Groups Seeded');

        Message::factory(2000)->create();

        $this->command->info('Messages Seeded');

        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($message){
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');
        })->map(function ($groupedMessages){
            return [
                'user_id_1'         => $groupedMessages->first()->sender_id,
                'user_id_2'         => $groupedMessages->first()->receiver_id,
                'last_message_id'   => $groupedMessages->last()->id,
                'created_at'        => new Carbon(),
                'updated_at'        => new Carbon()
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());
        $this->command->info('Conversation Seeded');

    }
}
