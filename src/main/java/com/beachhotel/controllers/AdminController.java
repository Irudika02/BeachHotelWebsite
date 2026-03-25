package com.beachhotel.controllers;

import com.beachhotel.models.*;
import com.beachhotel.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private InquiryRepository inquiryRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private GalleryImageRepository galleryImageRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private SubscriberRepository subscriberRepository;

    // --- Rooms ---
    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @PostMapping("/rooms")
    public Room addRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Inquiries ---
    @GetMapping("/inquiries")
    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    @PostMapping("/inquiries")
    public Inquiry addInquiry(@RequestBody Inquiry inquiry) {
        return inquiryRepository.save(inquiry);
    }

    @DeleteMapping("/inquiries/{id}")
    public ResponseEntity<?> deleteInquiry(@PathVariable Long id) {
        inquiryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Menu Items ---
    @GetMapping("/menu")
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @PostMapping("/menu")
    public MenuItem addMenuItem(@RequestBody MenuItem item) {
        return menuItemRepository.save(item);
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Gallery ---
    @GetMapping("/gallery")
    public List<GalleryImage> getAllGalleryImages() {
        return galleryImageRepository.findAll();
    }

    @PostMapping("/gallery")
    public GalleryImage addGalleryImage(@RequestBody GalleryImage img) {
        return galleryImageRepository.save(img);
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<?> deleteGalleryImage(@PathVariable Long id) {
        galleryImageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Reviews ---
    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping("/reviews")
    public Review addReview(@RequestBody Review review) {
        // By default, customer reviews are pending approval (default is false in model)
        // Removing forced setApproved(false) to allow admin to post pre-approved
        // reviews if needed
        return reviewRepository.save(review);
    }

    @PutMapping("/reviews/{id}/approve")
    public ResponseEntity<?> approveReview(@PathVariable Long id) {
        return reviewRepository.findById(id).map(r -> {
            r.setApproved(true);
            reviewRepository.save(r);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Offers ---
    @GetMapping("/offers")
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    @PostMapping("/offers")
    public Offer addOffer(@RequestBody Offer offer) {
        return offerRepository.save(offer);
    }

    @DeleteMapping("/offers/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        offerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Newsletter Subscribers ---
    @GetMapping("/subscribers")
    public List<Subscriber> getAllSubscribers() {
        return subscriberRepository.findAll();
    }

    @PostMapping("/subscribers")
    public Subscriber addSubscriber(@RequestBody Subscriber sub) {
        return subscriberRepository.save(sub);
    }

    @DeleteMapping("/subscribers/{id}")
    public ResponseEntity<?> deleteSubscriber(@PathVariable Long id) {
        subscriberRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
