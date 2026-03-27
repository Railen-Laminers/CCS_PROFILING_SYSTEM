<?php

namespace App\Http\Controllers;

use App\Services\EventService;
use Illuminate\Http\Request;

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
    public function store(Request $request)
    {
        $request->validate([
            'title'          => 'required|string|max:200',
            'description'    => 'required|string',
            'start_datetime' => 'required|date|before:end_datetime',
            'end_datetime'   => 'required|date|after:start_datetime',
        ]);

        $event = $this->eventService->create($request->only(['title', 'description', 'start_datetime', 'end_datetime']));

        return response()->json([
            'message' => 'Event created successfully',
            'event'   => $event->only(['event_id', 'title', 'description', 'start_datetime', 'end_datetime']),
        ], 201);
    }

    /**
     * Update the specified event.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title'          => 'sometimes|string|max:200',
            'description'    => 'sometimes|string',
            'start_datetime' => 'sometimes|date|before:end_datetime',
            'end_datetime'   => 'sometimes|date|after:start_datetime',
        ]);

        $event = $this->eventService->update($id, $request->only(['title', 'description', 'start_datetime', 'end_datetime']));

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