<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    /**
     * Display a listing of all events.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Get all events with selected fields
        $events = Event::select('event_id', 'title', 'description', 'start_datetime', 'end_datetime')
            ->get();

        return response()->json(['events' => $events], 200);
    }

    /**
     * Display the specified event by ID or title.
     * Can search using event_id or title (partial match).
     *
     * @param  string  $search
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($search)
    {
        // Check if search parameter is numeric (likely an ID)
        if (is_numeric($search)) {
            // Search by event_id
            $event = Event::select('event_id', 'title', 'description', 'start_datetime', 'end_datetime')
                ->where('event_id', $search)
                ->firstOrFail();
        } else {
            // Search by title (partial match using LIKE)
            $event = Event::select('event_id', 'title', 'description', 'start_datetime', 'end_datetime')
                ->where('title', 'LIKE', "%{$search}%")
                ->firstOrFail();
        }

        return response()->json(['event' => $event], 200);
    }

    /**
     * Store a newly created event.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'start_datetime' => 'required|date|before:end_datetime',
            'end_datetime' => 'required|date|after:start_datetime',
        ]);

        // Create the event
        $event = Event::create([
            'title' => $request->title,
            'description' => $request->description,
            'start_datetime' => $request->start_datetime,
            'end_datetime' => $request->end_datetime,
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event->only(['event_id', 'title', 'description', 'start_datetime', 'end_datetime']),
        ], 201);
    }

    /**
     * Update the specified event.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Find the event or fail
        $event = Event::findOrFail($id);

        // Validate the request data
        $request->validate([
            'title' => 'sometimes|string|max:200',
            'description' => 'sometimes|string',
            'start_datetime' => 'sometimes|date|before:end_datetime',
            'end_datetime' => 'sometimes|date|after:start_datetime',
        ]);

        // Prepare data for update
        $data = $request->only(['title', 'description', 'start_datetime', 'end_datetime']);
        
        // Update the event
        $event->update($data);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event->only(['event_id', 'title', 'description', 'start_datetime', 'end_datetime']),
        ], 200);
    }

    /**
     * Remove the specified event.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Find the event or fail
        $event = Event::findOrFail($id);
        
        // Delete the event
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully'], 200);
    }
}