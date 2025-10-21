package com.tp.backend.service;

import com.google.cloud.spring.vision.CloudVisionTemplate;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.Feature;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
@RequiredArgsConstructor
public class VisionApiService {

    private final CloudVisionTemplate  cloudVisionTemplate;

    public String extractFromImage(MultipartFile imgFile) throws IOException {
        String extractedTXT = null;

        Resource imageResource = new ByteArrayResource(imgFile.getBytes()){
            @Override
            public String getFilename() {
                return imgFile.getOriginalFilename();
            }
        };

        try{
            AnnotateImageResponse  response = this.cloudVisionTemplate.analyzeImage(imageResource, Feature.Type.TEXT_DETECTION);

            if(response != null && response.hasFullTextAnnotation()){
                extractedTXT = response.getFullTextAnnotation().getText();
                extractedTXT = extractedTXT.replaceAll("\n","").trim();
                log.debug("extractedTXT: {}", extractedTXT);
            }

        }catch (Exception e){
            log.error("Google Cloud Vision API 호출 오류", e);
            throw new IOException("Vision API 호출 중 오류 발생", e);
        }
        return extractedTXT;
    }
}
