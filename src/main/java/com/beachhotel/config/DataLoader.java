package com.beachhotel.config;

import com.beachhotel.models.*;
import com.beachhotel.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(RoomRepository roomRepo, MenuItemRepository menuRepo,
            GalleryImageRepository galleryRepo, ReviewRepository reviewRepo, OfferRepository offerRepo,
            SubscriberRepository subRepo) {
        return args -> {
            if (roomRepo.count() == 0) {
                // Rooms
                Room r1 = new Room();
                r1.setName("Ocean View Suite");
                r1.setPrice("250");
                r1.setImagePath("images/suite.png");
                r1.setDescription("Our flagship suite offers an unparalleled view of the Indian Ocean.");
                roomRepo.save(r1);
                Room r2 = new Room();
                r2.setName("Azure Family Villa");
                r2.setPrice("650");
                r2.setImagePath("images/villa.png");
                r2.setDescription("Spread over two levels, the Family Villa provides ample space for everyone.");
                roomRepo.save(r2);

                // Menu
                MenuItem m1 = new MenuItem();
                m1.setName("Live Hopper Station");
                m1.setPrice("12");
                m1.setCategory("Breakfast Classics");
                m1.setDescription("Crispy rice flour crepes served with lunu miris.");
                m1.setVeg(true);
                m1.setImagePath("images/food.png");
                menuRepo.save(m1);
                MenuItem m2 = new MenuItem();
                m2.setName("Jaffna Lagoon Crab Curry");
                m2.setPrice("35");
                m2.setCategory("Ocean Bounties");
                m2.setDescription("Whole crab cooked in roasted curry powder.");
                m2.setSpicy(true);
                m2.setImagePath("images/food.png");
                menuRepo.save(m2);

                // Gallery
                GalleryImage g1 = new GalleryImage();
                g1.setTitle("Resort Entrance");
                g1.setImagePath("images/hero.png");
                galleryRepo.save(g1);
                GalleryImage g2 = new GalleryImage();
                g2.setTitle("Suite Interior");
                g2.setImagePath("images/suite.png");
                galleryRepo.save(g2);
                GalleryImage g3 = new GalleryImage();
                g3.setTitle("Dining Experience");
                g3.setImagePath("images/food.png");
                galleryRepo.save(g3);
                GalleryImage g4 = new GalleryImage();
                g4.setTitle("Honeymoon Cabana");
                g4.setImagePath("images/cabana.png");
                galleryRepo.save(g4);

                // Reviews
                Review rev1 = new Review();
                rev1.setAuthor("Sarah Jenkins");
                rev1.setCountry("United Kingdom");
                rev1.setText(
                        "The best beach holiday we've ever had. The food was incredible, especially the Jaffna crab curry. The staff treated us like royalty!");
                rev1.setApproved(true);
                reviewRepo.save(rev1);
                Review rev2 = new Review();
                rev2.setAuthor("Markus Weber");
                rev2.setCountry("Germany");
                rev2.setText(
                        "Professional service and stunning views. The infinity pool is out of this world. We will definitely be coming back next year.");
                rev2.setApproved(true);
                reviewRepo.save(rev2);

                // Offers
                Offer o1 = new Offer();
                o1.setTitle("Honeymoon Romance Package");
                o1.setDiscount("30% OFF");
                o1.setDescription("Treat your partner to a romantic beach escape with dinner under the stars.");
                o1.setImagePath("images/cabana.png");
                offerRepo.save(o1);

                Offer o2 = new Offer();
                o2.setTitle("Family Summer Fun");
                o2.setDiscount("FREE BREAKFAST");
                o2.setDescription(
                        "Book our Family Villa and enjoy complimentary breakfast buffet for the whole family.");
                o2.setImagePath("images/villa.png");
                offerRepo.save(o2);

                // Subscribers
                Subscriber s1 = new Subscriber();
                s1.setEmail("guest@example.com");
                subRepo.save(s1);
            }
        };
    }
}
