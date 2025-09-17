package com.tp.backend.config;


import com.tp.backend.domain.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.database.builder.JpaItemWriterBuilder;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class CsvJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final EntityManagerFactory entityManagerFactory;

    @Bean
    public Job csvJob(){
        return new JobBuilder("csvJob",jobRepository)
                .start(csvStep())
                .build();
    }

    @Bean
    public Step csvStep(){
        return new StepBuilder("csvStep",jobRepository)
                .<Product,Product>chunk(200,transactionManager)
                .reader(productCsvReader())
                .writer(productJpaWriter())
                .build();
    }

    @Bean
    public FlatFileItemReader<Product> productCsvReader(){
        return new FlatFileItemReaderBuilder<Product>()
                .name("productCsvReader")
                .resource(new ClassPathResource("preprocessed_data_romanized.csv"))
                .linesToSkip(1)
                .delimited()
                .names("name", "manufacturer", "averagePrice", "surveyDate", "roman_name") // CSV 컬럼명
                .fieldSetMapper(new BeanWrapperFieldSetMapper<>(){{
                    setTargetType(Product.class);
                }})
                .build();
    }

    @Bean
    public JpaItemWriter<Product> productJpaWriter(){
        return new JpaItemWriterBuilder<Product>()
                .entityManagerFactory(entityManagerFactory)
                .build();
    }
}
