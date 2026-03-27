<?php

namespace App\Services;

use App\Models\Event;

class EventService
{
    /**
     * Get all events.
     */
    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return Event::select('event_id', 'title', 'description', 'start_datetime', 'end_datetime')->get();
    }

    /**
     * Find an event by ID or title (partial match).
     */
    public function findByIdentifier(string $search): Event
    {
        if (is_numeric($search)) {
            return Event::select('event_id', 'title', 'description', 'start_datetime', 'end_datetime')
                ->where('event_id', $search)
                ->firstOrFail();
        }

        return Event::select('event_id', 'title', 'description', 'start_datetime', 'end_datetime')
            ->where('title', 'LIKE', "%{$search}%")
            ->firstOrFail();
    }

    /**
     * Create a new event.
     */
    public function create(array $data): Event
    {
        return Event::create([
            'title'          => $data['title'],
            'description'    => $data['description'],
            'start_datetime' => $data['start_datetime'],
            'end_datetime'   => $data['end_datetime'],
        ]);
    }

    /**
     * Update an existing event.
     */
    public function update(int $id, array $data): Event
    {
        $event = Event::findOrFail($id);
        $event->update($data);
        return $event;
    }

    /**
     * Delete an event.
     */
    public function delete(int $id): void
    {
        $event = Event::findOrFail($id);
        $event->delete();
    }
}
