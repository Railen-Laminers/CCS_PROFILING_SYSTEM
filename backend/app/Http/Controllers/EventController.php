<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Services\EventService;

class EventController extends Controller
{
    public function __construct(
        private readonly EventService $eventService
    ) {}

    /**
     * Display a listing of all events.
     */
    public function index()
    {
        return response()->json(['events' => $this->eventService->getAll()], 200);
    }

    /**
     * Display the specified event by ID or title.
     */
    public function show($search)
    {
        return response()->json(['event' => $this->eventService->findByIdentifier($search)], 200);
    }

    /**
     * Store a newly created event.
     */
    public function store(StoreEventRequest $request)
    {
        $event = $this->eventService->create($request->validated());

        return response()->json([
            'message' => 'Event created successfully',
            'event'   => $event->only(['event_id', 'title', 'description', 'start_datetime', 'end_datetime']),
        ], 201);
    }

    /**
     * Update the specified event.
     */
    public function update(UpdateEventRequest $request, $id)
    {
        $event = $this->eventService->update($id, $request->validated());

        return response()->json([
            'message' => 'Event updated successfully',
            'event'   => $event->only(['event_id', 'title', 'description', 'start_datetime', 'end_datetime']),
        ], 200);
    }

    /**
     * Remove the specified event.
     */
    public function destroy($id)
    {
        $this->eventService->delete($id);

        return response()->json(['message' => 'Event deleted successfully'], 200);
    }
}